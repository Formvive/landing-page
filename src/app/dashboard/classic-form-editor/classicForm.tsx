"use client";
import { useState } from "react";
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

export default function ClassicFormEditor() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescriptionJSON, setFormDescriptionJSON] = useState("");
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<QuestionField[]>([]);
  const token = "PUT_REAL_TOKEN_HERE"; // 🔑 Replace with actual token logic
  const [formData, setFormData] = useState<Record<string, string>>({});


  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const addQuestion = (type: "textarea" | "radio") => {
    const newId = `q${questions.length + 1}`;
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

  const handleSave = async () => {
    try {
      setSaving(true);

      // 1️⃣ Create the form
      const formRes = await fetch(
        "https://form-vive-server.onrender.com/api/v1/user/create-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formName: formTitle || "Untitled Form" }),
        }
      );
      const formDataRes = await formRes.json();
      console.log(formRes)
      if (!formRes.ok || !formDataRes?.data?.id) {
        throw new Error("Failed to create form");
      }
      const formId = formDataRes.data.id;

      // 2️⃣ Prepare questions
      const mappedQuestions = questions.map((q) => ({
        text: q.text,
        type: q.type === "radio" ? "MULTIPLE_CHOICE" : "OPEN_ENDED",
        required: true,
        options:
          q.options?.map((opt) => ({
            text: opt,
            value: opt.toLowerCase(),
          })) || [],
      }));

      // 3️⃣ Send questions to API
      const questionsRes = await fetch(
        "https://form-vive-server.onrender.com/api/v1/user/create-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formId, questions: mappedQuestions }),
        }
      );
      if (!questionsRes.ok) {
        throw new Error("Failed to create questions");
      }

      alert("Form & questions saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving form");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{formTitle || "Untitled form"}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 pb-2">
        {["Classic mode", "Story mode", "Chat mode"].map((tab) => (
          <button
            key={tab}
            className={`text-sm font-medium ${
              tab === "Classic mode"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title and Description */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <input
          type="text"
          placeholder="Form Title"
          className="w-full text-2xl font-semibold outline-none"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <RichTextEditor onChange={setFormDescriptionJSON} />
      </div>

      {/* Add Question Button */}
      <div className="pt-4 flex gap-4">
        <button
          type="button"
          onClick={() => addQuestion("textarea")}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ➕ Add Open-ended Question
        </button>

        <button
          type="button"
          onClick={() => addQuestion("radio")}
          className="flex items-center text-sm text-green-600 hover:text-green-800"
        >
          ➕ Add Multiple Choice Question
        </button>
      </div>

      {/* Sortable Questions */}
      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((field) => (
              <SortableQuestionCard
                key={field.id}
                id={field.id}
                field={field}
                answerValue={formData[field.name] || ""}
                onAnswerChange={(id, val) =>
                  setFormData((prev) => ({ ...prev, [field.name]: val }))
                }
                onLabelChange={(id, newLabel) =>
                  setQuestions((prev) =>
                    prev.map((q) => (q.id === id ? { ...q, text: newLabel } : q))
                  )
                }
                onOptionsChange={(id, newOptions) =>
                  setQuestions((prev) =>
                    prev.map((q) => (q.id === id ? { ...q, options: newOptions } : q))
                  )
                }
                onDelete={(id) =>
                  setQuestions((prev) => prev.filter((q) => q.id !== id))
                }
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Preview Button */}
      <div className="text-center pt-6">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Preview
        </button>
      </div>

      {/* Preview Modal */}
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
