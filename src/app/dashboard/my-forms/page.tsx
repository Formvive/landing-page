"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List, FileEdit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Form } from "@/types";

export default function MyFormsPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchForms = async () => {
      try {
        const res = await fetch(
          "https://form-vive-server.onrender.com/api/v1/user/get-forms",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        console.log("Fetched forms:", data);

        setForms(data?.data || []);
        if (data?.data?.length > 10) {
          setPageSize(10); // Reset to first page if forms exist
        }
      } catch (error) {
        console.error("Failed to fetch forms:", error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [token]);

  if (loading) {
    return <p className="text-gray-500">Loading your forms...</p>;
  }

  if (forms.length === 0) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">My Forms (0)</h1>
          <Link href={"/dashboard/create-form"}>
            <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md">
              <Plus size={16} /> Create Form
            </button>
          </Link>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40">
          <p className="text-gray-500">You haven’t created any forms yet.</p>
        </div>
      </div>
    );
  }

  // 🔹 Pagination logic
  const totalForms = forms.length;
  const totalPages = Math.ceil(totalForms / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalForms);
  const paginatedForms = forms.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Forms ({totalForms})</h1>
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

      {/* List view */}
      {view === "list" ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr className="text-center">
                <th className="px-6 py-3">Form Name</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3">Responses</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedForms.map((form) => (
                <tr key={form.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="px-6 py-4">{form.formName}</td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4">{form.responseCount ?? 0}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/my-forms/${form.id}`}
                      className="text-black font-semibold underline"
                    >
                      View more
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid view
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {paginatedForms.map((form) => (
            <div
              key={form.id}
              className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
            >
              <FileEdit size={32} className="mb-2" />
              <span className="text-sm font-medium text-center">
                {form.formName}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {form.responseCount ?? 0}
              </span>
              <button className="text-blue-600 underline text-xs">
                <Link
                  href={`/dashboard/my-forms/${form.id}`}
                  className="text-blue-600 underline"
                >
                  View more
                </Link>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          Showing {startIndex + 1} - {endIndex} of {totalForms}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded hover:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ⏪
          </button>
          <select
            className="border rounded px-1 py-0.5 text-xs"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <button
            className="p-1 rounded hover:bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            ⏩
          </button>
        </div>
      </div>
    </div>
  );
}
