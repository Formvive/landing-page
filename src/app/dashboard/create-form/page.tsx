"use client";
import { LayoutGrid, List, Plus, FileEdit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyFormsPage() {
  const router = useRouter();
  const [view, setView] = useState("grid");

  const recentForms = [
    { name: "Customer survey feedback", edited: "Last edited 10th July, 2025" },
    { name: "Contact information", edited: "Last edited 10th July, 2025" },
    { name: "User Research", edited: "Last edited 10th July, 2025" },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Start new form section */}
      <div>
        <h1 className="text-xl font-semibold mb-4">Start new form</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/dashboard/classic-form-editor")}>
            <Plus size={32} />
            <span className="mt-2 text-sm">Classic form</span>
          </div>
          <div className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer">
            <Image width={1000} height={1000} src="/assets/images/chatform.svg" alt="Chat form" className="w-16 h-16 object-contain mb-2" />
            <span className="text-sm">Chat based form</span>
          </div>
          <div className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer">
            <Image width={1000} height={1000} src="/assets/images/storyform.svg" alt="Story form" className="w-16 h-16 object-contain mb-2" />
            <span className="text-sm">Story based form</span>
          </div>
          <div className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer">
            <Plus size={32} />
            <span className="mt-2 text-sm">Game based form</span>
          </div>
        </div>
      </div>

      {/* Recent forms section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent forms</h2>
          <div className="flex items-center gap-2">
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

        {view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentForms.map((form, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
              >
                <FileEdit size={32} className="mb-2" />
                <span className="text-sm font-medium text-center">{form.name}</span>
                <span className="text-xs text-gray-500 mt-1">{form.edited}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-6 py-3">Form Name</th>
                  <th className="px-6 py-3">Last Edited</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentForms.map((form, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{form.name}</td>
                    <td className="px-6 py-4">{form.edited}</td>
                    <td className="px-6 py-4 text-blue-600 underline cursor-pointer">
                      View more
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
