"use client";
import React from "react";

interface QuestionCardProps {
  label: string;
  type: "input" | "textarea" | "radio";
  name: string;
  value: string;
  options?: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDelete?: () => void;
}

export default function QuestionCard({
  label,
  type,
  name,
  value,
  options,
  onChange,
  onDelete,
}: QuestionCardProps) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-2 relative group">
      <label className="block font-medium">{label}</label>
      {type === "textarea" && (
        <textarea
          name={name}
          rows={4}
          className="w-full border rounded p-2"
          value={value}
          onChange={onChange}
        />
      )}
      {type === "input" && (
        <input
          type="text"
          name={name}
          className="w-full border rounded p-2"
          value={value}
          onChange={onChange}
        />
      )}
      {type === "radio" && options?.length && (
        <div className="space-y-1">
          {options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={onChange}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm hidden group-hover:block"
        >
          Delete
        </button>
      )}
    </div>
  );
}
