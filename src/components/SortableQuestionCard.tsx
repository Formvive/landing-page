"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionField } from "@/types";
import { GripVertical, Trash2 } from "lucide-react";

type Props = {
  id: string;
  field: QuestionField;
  answerValue: string;
  onAnswerChange: (id: string, value: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
  onOptionsChange?: (id: string, newOptions: string[]) => void;
  onDelete?: (id: string) => void;
};

export default function SortableQuestionCard({
  id,
  field,
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
      className="bg-white border rounded-lg shadow p-4 relative"
    >
      {/* Drag handle */}
      <div
        className="absolute left-2 top-2 cursor-move text-gray-400"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="absolute right-2 top-2 text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Question label */}
      <input
        type="text"
        value={field.text}
        onChange={(e) => onLabelChange(id, e.target.value)}
        className="w-full font-medium text-lg mb-3 outline-none border-b"
        placeholder="Enter question label"
      />

      {/* Input types */}
      {field.type === "textarea" && (
        <textarea
          className="w-full border rounded p-2"
          placeholder="User answer..."
          disabled
        />
      )}

      {field.type === "input" && (
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="User answer..."
          disabled
        />
      )}

      {field.type === "radio" && (
        <div className="space-y-2">
          {(field.options || []).map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="radio" disabled />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleEditOption(index, e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add new option */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="New option"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
