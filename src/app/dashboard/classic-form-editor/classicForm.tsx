"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { QuestionField } from "@/types";
import RichTextEditor from "@/components/LexicalEditor";
import PreviewModal from "@/components/PreviewModal";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableQuestionCard from "@/components/SortableQuestionCard";
import { FiEdit3, FiCheckCircle } from "react-icons/fi";

/**
 * Props:
 * - onSaveReady(saveFn | null) => gives parent a function to call to save
 * - onSavingChange?(saving: boolean) => optional callback to notify parent
 * - onSaveComplete?({ success, formId?, message? }) => notify parent of save result
 */
export default function ClassicFormEditor({
  onSaveReady,
  onSavingChange,
  onSaveComplete,
}: {
  onSaveReady?: (saveFn: (() => Promise<void>) | null) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveComplete?: (payload: { success: boolean; formId?: string; message?: string }) => void;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescriptionJSON, setFormDescriptionJSON] = useState("");
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [questions, setQuestions] = useState<QuestionField[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("authToken");
      if (!t) {
        console.warn("No auth token found. Save will fail until you sign in.");
      }
      setToken(t);
    }
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over?.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const addQuestion = (type: "textarea" | "radio") => {
    const nextIndex = questions.length + 1;
    const newId = `q${Date.now().toString(36)}${nextIndex}`;
    const newQuestion: QuestionField = {
      id: newId,
      text: "New question",
      type,
      name: `field_${newId}`,
      value: "",
      options: type === "radio" ? ["Option 1", "Option 2"] : [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  // stable save function
  const handleSave = useCallback(async () => {
    if (savingRef.current) return; // prevent concurrent saves
    if (!token) {
      onSaveComplete?.({ success: false, message: "Not authenticated" });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    onSavingChange?.(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // 1) create form
      const createRes = await fetch(
        "https://form-vive-server.onrender.com/api/v1/user/create-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formName: formTitle || "Untitled Form" }),
          signal: controller.signal,
        }
      );

      if (!createRes.ok) {
        const t = await createRes.text().catch(() => "");
        throw new Error(`create-form failed: ${createRes.status} ${t}`);
      }

      const createJson = await createRes.json();
      const formId = createJson?.data?.id;
      if (!formId) throw new Error("Invalid form id returned");

      // 2) prepare questions
      const mappedQuestions = (questions || []).map((q) => ({
        text: q.text,
        type: q.type === "radio" ? "MULTIPLE_CHOICE" : "OPEN_ENDED",
        // required: !!q.required ?? true,
        options:
          (q.options || []).map((opt) => ({
            text: opt,
            value: String(opt).toLowerCase().replace(/\s+/g, "_"),
          })) || [],
      }));

      // 3) create questions
      const questionsRes = await fetch(
        "https://form-vive-server.onrender.com/api/v1/user/create-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formId, questions: mappedQuestions }),
          signal: controller.signal,
        }
      );

      if (!questionsRes.ok) {
        const t = await questionsRes.text().catch(() => "");
        throw new Error(`create-questions failed: ${questionsRes.status} ${t}`);
      }

      // success
      onSaveComplete?.({ success: true, formId, message: "Form saved" });
    } catch (err: unknown) {
      console.error("Save error", err);
      const message = err instanceof Error ? err.message : "Save failed";
      onSaveComplete?.({ success: false, message });
    } finally {
      savingRef.current = false;
      setSaving(false);
      onSavingChange?.(false);
      abortRef.current = null;
    }
  }, [formTitle, questions, token, onSaveComplete, onSavingChange]);

  // expose save function to parent and clear on unmount
  useEffect(() => {
    onSaveReady?.(handleSave);
    return () => {
      if (abortRef.current) abortRef.current.abort();
      onSaveReady?.(null);
    };
  }, [handleSave, onSaveReady]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{formTitle || "Untitled form"}</h2>
        <div>
          <button
            onClick={() => handleSave()}
            disabled={saving || !token}
            className="mr-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <input
          disabled={saving}
          type="text"
          placeholder="Form Title"
          className="w-full text-2xl font-semibold outline-none"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <RichTextEditor onChange={setFormDescriptionJSON} />
      </div>

      {/* Sortable questions */}
      <div className="space-y-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((field) => (
              <SortableQuestionCard
                key={field.id}
                id={field.id}
                field={field}
                answerValue={formData[field.name] || ""}
                onAnswerChange={(id, val) => setFormData((prev) => ({ ...prev, [field.name]: val }))}
                onLabelChange={(id, newLabel) =>
                  setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text: newLabel } : q)))
                }
                onOptionsChange={(id, newOptions) =>
                  setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, options: newOptions } : q)))
                }
                onDelete={(id) => setQuestions((prev) => prev.filter((q) => q.id !== id))}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Floating toolbar */}
      <div className="fixed right-6 top-1/3 flex flex-col gap-4 bg-white p-2 rounded-xl shadow-md">
        <button
          type="button"
          onClick={() => addQuestion("textarea")}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Add Open-ended Question"
        >
          <FiEdit3 className="text-gray-700" size={20} />
        </button>
        <button
          type="button"
          onClick={() => addQuestion("radio")}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Add Multiple Choice Question"
        >
          <FiCheckCircle className="text-gray-700" size={20} />
        </button>
      </div>

      {/* Preview */}
      <div className="text-center pt-6">
        <button onClick={() => setIsPreviewOpen(true)} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Preview
        </button>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formTitle}
        description={formDescriptionJSON}
        questions={questions}
      />
    </div>
  );
}
