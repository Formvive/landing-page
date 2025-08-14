"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionField } from "@/types";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  field: QuestionField;
  answerValue: string; // renamed for clarity
  onAnswerChange: (id: string, value: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
};

export default function SortableQuestionCard({
  id,
  field,
  answerValue,
  onAnswerChange,
  onLabelChange,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-xl p-4 flex flex-col space-y-3 relative"
    >
      {/* Drag handle */}
      <div
        className="absolute left-2 top-2 cursor-move text-gray-400"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </div>

      {/* Editable question label */}
      <input
        type="text"
        value={field.text}
        onChange={(e) => onLabelChange(id, e.target.value)}
        className="font-medium text-gray-800 border-b focus:outline-none"
        placeholder="Enter question label"
      />

      {/* Answer field */}
      {field.type === "input" && (
        <input
          type="text"
          name={field.name}
          value={answerValue}
          onChange={(e) => onAnswerChange(id, e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          name={field.name}
          value={answerValue}
          onChange={(e) => onAnswerChange(id, e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      {field.type === "radio" &&
        field.options?.map((option, idx) => (
          <label key={idx} className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name={field.name}
              value={option}
              checked={answerValue === option}
              onChange={(e) => onAnswerChange(id, e.target.value)}
            />
            <span>{option}</span>
          </label>
        ))}
    </div>
  );
}
