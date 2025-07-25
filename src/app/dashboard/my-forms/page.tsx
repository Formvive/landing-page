"use client";
import { useState } from "react";
import Link from 'next/link';
import { Plus, LayoutGrid, List, FileEdit } from "lucide-react";

export default function MyFormsPage() {
  const [view, setView] = useState<"list" | "grid">("list");

  const forms = Array(6).fill({
    name: "Customer Survey Feedback",
    updated: "1 hour ago",
    responses: 123,
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Forms ({forms.length})</h1>
        <div className="flex items-center gap-2">
          <Link href={"/dashboard/create-form"}>
            <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md">
              <Plus size={16} /> Create Form
            </button>
          </Link>
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md ${view === "grid" ? "bg-gray-100" : ""}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md ${view === "list" ? "bg-gray-100" : ""}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Conditional rendering based on view */}
      {view === "list" ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-6 py-3">Form Name</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3">Responses</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{form.name}</td>
                  <td className="px-6 py-4">{form.updated}</td>
                  <td className="px-6 py-4">{form.responses}</td>
                  <td className="px-6 py-4 text-blue-600 underline cursor-pointer">
                    View more
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {forms.map((form, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
          >
            <FileEdit size={32} className="mb-2" />
            <span className="text-sm font-medium text-center">{form.name}</span>
            <span className="text-xs text-gray-500 mt-1">{form.updated}</span>
            <span className="text-xs text-gray-500 mt-1">{form.responses}</span>
            <button className="text-blue-600 underline text-xs">View more</button>
          </div>
        ))}
      </div>
      )}

      {/* Footer / Pagination */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Showing 1 - {forms.length} results of {forms.length}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-200">⏪</button>
          <select className="border rounded px-1 py-0.5 text-xs">
            <option>01</option>
          </select>
          <button className="p-1 rounded hover:bg-gray-200">⏩</button>
        </div>
      </div>
    </div>
  );
}
