"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionField } from "@/types";
import { GripVertical, Trash2, PlusCircle, X } from "lucide-react";

type Props = {
  id: string;
  field: QuestionField;
  answerValue?: string;
  onAnswerChange?: (id: string, value: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
  onOptionsChange?: (id: string, newOptions: string[]) => void;
  onDelete?: (id: string) => void;
};

export default function SortableQuestionCard({
  id,
  field,
  // answerValue,
  // onAnswerChange,
  onLabelChange,
  onOptionsChange,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const updated = [...(field.options || []), newOption.trim()];
    onOptionsChange?.(id, updated);
    setNewOption("");
  };

  const handleRemoveOption = (optIndex: number) => {
    const updated = (field.options || []).filter((_, i) => i !== optIndex);
    onOptionsChange?.(id, updated);
  };

  const handleEditOption = (optIndex: number, value: string) => {
    const updated = [...(field.options || [])];
    updated[optIndex] = value;
    onOptionsChange?.(id, updated);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-xl shadow-sm p-5 relative hover:shadow-md transition"
    >
      {/* Drag handle */}
      <div
        className="absolute -left-6 top-6 cursor-grab text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Question label */}
      <input
        type="text"
        value={field.text}
        onChange={(e) => onLabelChange(id, e.target.value)}
        className="w-full text-base font-medium outline-none border-b border-gray-200 focus:border-black pb-1"
        placeholder="Enter your question"
      />

      {/* Input types */}
      <div className="mt-4">
        {field.type === "textarea" && (
          <textarea
            className="w-full border-b border-gray-200 focus:border-black outline-none resize-none text-sm py-1"
            placeholder="Long answer text"
            disabled
          />
        )}

        {field.type === "input" && (
          <input
            type="text"
            className="w-full border-b border-gray-200 focus:border-black outline-none text-sm py-1"
            placeholder="Short answer text"
            disabled
          />
        )}

        {field.type === "radio" && (
          <div className="space-y-3">
            {(field.options || []).map((opt, index) => (
              <div key={index} className="flex items-center gap-3">
                <input type="radio" disabled className="text-black" />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleEditOption(index, e.target.value)}
                  className="flex-1 border-b border-gray-200 focus:border-black outline-none text-sm py-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Add new option */}
            <div className="flex items-center gap-3 pt-2">
              <PlusCircle
                size={18}
                className="text-green-500 cursor-pointer hover:text-green-600"
                onClick={handleAddOption}
              />
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="flex-1 border-b border-gray-200 focus:border-black outline-none text-sm py-1"
                placeholder="Add option"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
