"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List, FileEdit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Form } from "@/types";
import { getAuthToken } from "@/utils/authHelper";

export default function MyFormsPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  // const [token, setToken] = useState<string | null>(null);
  const token = getAuthToken();

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // ✅ Pagination handlers
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("authToken");
  //   setToken(storedToken);
  // }, []);

  useEffect(() => {
    if (!token) return;
  
    const fetchForms = async () => {
      try {
        const res = await fetch("https://form-vive-server.onrender.com/api/v1/user/get-forms", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
  
        // ✅ Sort by most recent updatedAt first
        const sortedForms = (data?.data || []).sort(
          (a: Form, b: Form) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
  
        setForms(sortedForms);
        if (sortedForms.length > 10) {
          setPageSize(10);
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

      {/* Footer - Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
