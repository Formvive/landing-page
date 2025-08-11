"use client";
import Link from 'next/link';
import { Draft } from "@/types";
import { Plus, Pencil } from "lucide-react";

export default function MyDraftsPage() {
    const drafts: Draft[] = [
        {
          title: "Customer Feedback Survey",
          mode: "Story Mode",
          questions: 5,
          lastEdited: "July 18, 2025 - 9:00am",
        },
        {
          title: "Customer Feedback Survey",
          mode: "Story Mode",
          questions: 5,
          lastEdited: "July 18, 2025 - 9:00am",
        },
        {
          title: "Customer Feedback Survey",
          mode: "Story Mode",
          questions: 5,
          lastEdited: "July 18, 2025 - 9:00am",
        },
      ];

    if (drafts.length === 0) {
    return (
        <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">My Drafts (0)</h1>
            <Link href={"/dashboard/create-form"}>
            <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md">
                <Plus size={16} /> Create New Form
            </button>
            </Link>
        </div>
        <h1 className="text-sm text-gray-500">Start a new form and it’ll appear here automatically.</h1>
        {/* Empty placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40">
            <p className="text-gray-500">No drafts yet.</p>
        </div>
        </div>
    );
}

return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          My drafts ({drafts.length})
        </h1>
        <Link href="/dashboard/create-form">
          <button className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md">
            <Plus size={16} /> Create new Form
          </button>
        </Link>
      </div>

      {/* Draft cards */}
      <div className="flex flex-col gap-4">
        {drafts.map((draft, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            {/* Left content */}
            <div>
              <h2 className="text-lg font-medium">{draft.title}</h2>
              <p className="text-sm">
                Mode – <span className="font-semibold">{draft.mode}</span>
              </p>
              <p className="text-sm">
                Questions Added: {draft.questions}
              </p>
              <p className="text-sm">
                Last edited:{" "}
                <span className="font-semibold">{draft.lastEdited}</span>
              </p>
            </div>

            {/* Right actions */}
            <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
              <button className="flex items-center gap-1 font-semibold text-black">
                <Pencil size={16} /> Continue Editing
              </button>
              <button className="text-green-600 text-sm">✓ Publish</button>
              <button className="text-red-600 text-sm">🗑 Discard</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}