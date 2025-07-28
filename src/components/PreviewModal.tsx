"use client";
import React from "react";
import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { QuestionField } from "@/types";
import PreviewRichText from "./PreviewRichText";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  questions: QuestionField[];
  formData?: Record<string, string>;
}

export default function PreviewModal({
  isOpen,
  onClose,
  title,
  description,
  questions,
  formData = {},
}: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-xl p-6 max-w-3xl w-full shadow-xl space-y-6 max-h-3/4 overflow-y-scroll">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <PreviewRichText content={description} />
            <div className="space-y-4">
                {questions.map((field) => (
                <div key={field.id} className="border rounded p-4 space-y-2">
                    <label className="font-semibold block">{field.label}</label>

                    {field.type === "input" && (
                    <input
                        type="text"
                        value={formData[field.name] || ""}
                        readOnly
                        className="w-full border px-2 py-1 rounded bg-gray-100"
                    />
                    )}

                    {field.type === "textarea" && (
                    <textarea
                        value={formData[field.name] || ""}
                        readOnly
                        className="w-full border px-2 py-1 rounded bg-gray-100"
                    />
                    )}

                    {field.type === "radio" && field.options?.map((option, idx) => (
                    <label key={idx} className="inline-flex items-center space-x-2 mr-4">
                        <input
                        type="radio"
                        value={option}
                        checked={formData[field.name] === option}
                        readOnly
                        disabled
                        />
                        <span>{option}</span>
                    </label>
                    ))}
                </div>
                ))}
            </div>

            <div className="text-right">
                <button
                onClick={onClose}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                Close
                </button>
            </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
