"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionField } from "@/types";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  field: QuestionField;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function SortableQuestionCard({ id, field, value, onChange }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

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
      <div className="absolute left-2 top-2 cursor-move text-gray-400" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>

      <label className="font-medium text-gray-800">{field.label}</label>

      {field.type === "input" && (
        <input
          type="text"
          name={field.name}
          value={value}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
      )}

      {field.type === "radio" && field.options?.map((option, idx) => (
        <label key={idx} className="inline-flex items-center space-x-2">
          <input
            type="radio"
            name={field.name} // important: unique group name per question
            value={option}
            checked={value === option}
            onChange={onChange}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
