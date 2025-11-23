"use client";

import { useState } from "react";
import { FormDetails, Question, QuestionOption } from "@/types";

interface EditFormTabProps {
  formDetails: FormDetails;
  questions: Question[];
  token: string | null;
  // New Props for syncing
  onUpdateQuestions: (questions: Question[]) => void;
  onUpdateFormName: (name: string) => void;
}

const BASE_URL = "https://form-vive-server.onrender.com/api/v1/user";

export default function EditFormTab({ 
  formDetails, 
  questions: initialQuestions, 
  token,
  onUpdateQuestions,
  onUpdateFormName
}: EditFormTabProps) {
  
  // Local state for immediate UI feedback
  const [formName, setFormName] = useState(formDetails.formName || "");
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // --- 1. Form Name Logic ---
  const handleNameBlur = async () => {
    if (formName === formDetails.formName) return;
    setSavingId("form-name");
    try {
      const res = await fetch(`${BASE_URL}/update-form/${formDetails.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ formName }),
      });
      if (res.ok) {
        // SYNC: Tell parent the name changed
        onUpdateFormName(formName); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  // --- 2. Helper to update local and parent state ---
  // This ensures that even before the API saves, the parent knows about the change 
  // so if you switch tabs instantly, the data is there.
  const handleQuestionChange = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    // Optional: You can sync to parent immediately or wait for save. 
    // Syncing immediately is safer for tab switching.
    onUpdateQuestions(newQuestions); 
  };

  const updateQuestionState = (id: string, updates: Partial<Question>) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, ...updates } : q));
    handleQuestionChange(updated);
  };

  const updateOptionState = (qId: string, optId: string, updates: Partial<QuestionOption>) => {
    const updated = questions.map((q) => {
      if (q.id !== qId) return q;
      return {
        ...q,
        options: (q.options || []).map((o) => (o.id === optId ? { ...o, ...updates } : o)),
      };
    });
    handleQuestionChange(updated);
  };

  // --- 3. Save Question ---
  const saveQuestion = async (q: Question) => {
    setSavingId(q.id);
    try {
      // Note: We only send text/type/required. Options are not upserted here as per your request.
      await fetch(`${BASE_URL}/update-question/${q.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          text: q.text,
          type: q.type,
          required: q.required,
        }),
      });
      // No need to sync here if we synced in handleChange, but good to ensure consistency
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  // --- 4. Save Option ---
  const saveOption = async (opt: QuestionOption) => {
    setSavingId(opt.id);
    try {
      await fetch(`${BASE_URL}/update-question-option/${opt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          option: opt.option,
          value: opt.value,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  // --- 5. Create Question ---
  const handleAddQuestion = async () => {
    setIsCreating(true);
    try {
      const newQuestionPayload = {
        text: "Untitled Question",
        type: "MULTIPLE_CHOICE",
        required: false,
        options: [
          { option: "Option 1", value: "option_1" },
          { option: "Option 2", value: "option_2" }
        ]
      };

      const res = await fetch(`${BASE_URL}/create-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          formId: formDetails.id,
          questions: [newQuestionPayload], 
        }),
      });

      const json = await res.json();
      if (json.status === "ok" && Array.isArray(json.data)) {
        const updatedQuestions = [...questions, ...json.data];
        
        // Update Local
        setQuestions(updatedQuestions);
        // SYNC: Update Parent
        onUpdateQuestions(updatedQuestions); 

        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Form Name */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
          Form Details
        </label>
        <input
          className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 outline-none border-b border-transparent focus:border-black transition-all pb-2"
          placeholder="Untitled Form"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          onBlur={handleNameBlur}
        />
        {savingId === "form-name" && (
          <span className="absolute top-6 right-6 text-xs text-gray-400 animate-pulse">Saving...</span>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
            {savingId === q.id && (
              <span className="absolute top-4 right-4 text-xs text-gray-400 animate-pulse">Saving...</span>
            )}
            {savingId === "option-save" && ( // Generic saving indicator for options
               <span className="absolute top-4 right-16 text-xs text-gray-400 animate-pulse">Saving option...</span>
            )}

            <div className="flex gap-4 items-start mb-6">
              <span className="text-gray-400 font-medium pt-3">{index + 1}.</span>
              <div className="flex-1 space-y-4">
                <input
                  className="w-full text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-transparent focus:bg-white focus:border-black outline-none transition-all"
                  value={q.text}
                  onChange={(e) => updateQuestionState(q.id, { text: e.target.value })}
                  onBlur={() => saveQuestion(q)}
                  placeholder="Question text"
                />

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 outline-none focus:border-black cursor-pointer"
                      value={q.type}
                      onChange={(e) => {
                         const newType = e.target.value;
                         updateQuestionState(q.id, { type: newType });
                         saveQuestion({ ...q, type: newType });
                      }}
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="OPEN_ENDED">Open Ended</option>
                      <option value="SINGLE_CHOICE">Single Choice</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="accent-black h-4 w-4"
                      checked={q.required}
                      onChange={(e) => {
                         const newReq = e.target.checked;
                         updateQuestionState(q.id, { required: newReq });
                         saveQuestion({ ...q, required: newReq });
                      }}
                    />
                    <span className="text-sm text-gray-600">Required</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Options (Standard Editing Only) */}
            {(q.type === "MULTIPLE_CHOICE" || q.type === "SINGLE_CHOICE") && (
              <div className="pl-8 ml-4 border-l-2 border-gray-100 space-y-3">
                 <label className="text-xs font-semibold text-gray-400 uppercase">Options</label>
                {(q.options || []).map((opt) => (
                  <div key={opt.id} className="grid grid-cols-2 gap-2 relative">
                     <input
                      className="text-sm border-b border-gray-200 focus:border-black outline-none py-1 text-gray-700"
                      value={opt.option}
                      onChange={(e) => updateOptionState(q.id, opt.id, { option: e.target.value })}
                      onBlur={() => saveOption(opt)}
                      placeholder="Label"
                    />
                     <input
                      className="text-sm border-b border-gray-200 focus:border-black outline-none py-1 text-gray-500 font-mono bg-gray-50 px-2"
                      value={opt.value}
                      onChange={(e) => updateOptionState(q.id, opt.id, { value: e.target.value })}
                      onBlur={() => saveOption(opt)}
                      placeholder="Value"
                    />
                  </div>
                ))}
                {(!q.options || q.options.length === 0) && (
                   <p className="text-sm text-gray-400 italic">No options.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Create Button */}
      <div className="text-center pt-8">
        <button 
          onClick={handleAddQuestion}
          disabled={isCreating}
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {isCreating ? <span>Creating...</span> : <><span>+</span> Add New Question</>}
        </button>
      </div>
    </div>
  );
}