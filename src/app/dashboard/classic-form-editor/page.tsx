"use client";

import { useState, useCallback, useEffect } from "react";
import ClassicFormEditor from "./classicForm";

/** Very small Toast UI — replace or style as you like */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className="bg-black text-white px-4 py-2 rounded shadow">
        {message}
      </div>
    </div>
  );
}

function StoryFormEditor() {
  return (
    <div className="p-6 space-y-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold">📖 Story Mode</h3>
      <div className="space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg leading-relaxed text-gray-800">
          Once upon a time...
        </div>
      </div>
    </div>
  );
}

function ChatFormEditor() {
  return <div className="p-6 bg-white rounded-xl shadow-md">Chat editor</div>;
}

export default function FormEditor() {
  type Mode = "chat" | "story" | "classic";
  const [mode, setMode] = useState<Mode>("classic");
  const [saveFn, setSaveFn] = useState<(() => Promise<void>) | null>(null);
  const [childSaving, setChildSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // stable callbacks passed to child
  const handleOnSaveReady = useCallback((fn: (() => Promise<void>) | null) => {
    // store the function reference in state
    setSaveFn(() => fn);
  }, []);

  const handleOnSavingChange = useCallback((s: boolean) => {
    setChildSaving(s);
  }, []);

  const handleOnSaveComplete = useCallback(
    (payload: { success: boolean; formId?: string; message?: string }) => {
      if (payload.success) {
        setToastMsg(payload.message ?? "Form saved successfully");
        // optionally redirect to the new form page:
        // if (payload.formId) router.push(`/dashboard/my-forms/${payload.formId}`)
      } else {
        setToastMsg(`Save failed: ${payload.message ?? "Unknown error"}`);
      }
    },
    []
  );

  const doGlobalSave = async () => {
    if (!saveFn) return;
    try {
      await saveFn();
    } catch (err) {
      // handle, but the child will call onSaveComplete so toast will show
      console.error("Global save failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Untitled form</h2>
        <button
          onClick={doGlobalSave}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
          disabled={!saveFn || childSaving}
        >
          {childSaving ? "Saving…" : saveFn ? "Save & Continue" : "Preparing…"}
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 pb-2">
        {(["classic"] as Mode[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMode(tab)}
            className={`text-sm font-medium pb-1 ${
              tab === mode ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Mode
          </button>
        ))}
      </div>

      {/* Mode content */}
      {mode === "classic" && (
        <ClassicFormEditor
          onSaveReady={handleOnSaveReady}
          onSavingChange={handleOnSavingChange}
          onSaveComplete={handleOnSaveComplete}
        />
      )}
      {mode === "story" && <StoryFormEditor />}
      {mode === "chat" && <ChatFormEditor />}

      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
