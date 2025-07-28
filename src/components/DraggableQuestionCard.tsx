// components/DraggableQuestionCard.tsx
"use client";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import QuestionCard from "./QuestionCard";

interface DraggableProps {
  id: string;
  index: number;
  question: {
    label: string;
    type: "input" | "textarea" | "radio";
    name: string;
    value: string;
    options?: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => void;
  onDelete: (id: string) => void;
}

export default function DraggableQuestionCard({
  id,
  question,
  onChange,
  onDelete,
}: DraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <QuestionCard
        {...question}
        onChange={(e) => onChange(e, id)}
        onDelete={() => onDelete(id)}
      />
    </div>
  );
}
