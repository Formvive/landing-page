"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import QuestionsTab from "@/components/QuestionsTab";
import { ResponseItem } from "@/types";

type ResponseData = {
  id: string;
  userId: string;
  formName: string;
  createdAt: string;
  updatedAt: string;
  responses: ResponseItem[];
};

export default function FormDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = useMemo(() => searchParams.get("tab") || "responses", [searchParams]);
  const [subTab, setSubTab] = useState<"summary" | "questions" | "individual">("summary");

  const [formDetails, setFormDetails] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const formId = id as string;
  useEffect(() => {
    if (!token || !formId) return;

    const fetchFormDetails = async () => {
      try {
        const res = await fetch(
          `https://form-vive-server.onrender.com/api/v1/user/get-singular-form/${encodeURIComponent(formId)}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        console.log("Fetching form details for ID:", formId);
        console.log("Fetched form details:", res);

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setFormDetails(data.data);
      } catch (err) {
        console.error("Failed to fetch form details:", err);
        setFormDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetails();
  }, [token, formId]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading form details...</p>;
  }

  if (!formDetails) {
    return <p className="p-6 text-red-500">Failed to load form details.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/dashboard/my-forms" className="underline">
          My Forms
        </Link> &gt; {formDetails?.formName ?? id}
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold">
        {formDetails?.formName ?? "Untitled Form"}
      </h1>

      {/* Top-level tabs */}
      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${
            activeTab === "responses"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("responses")}
        >
          Responses ({formDetails?.responses?.length ?? 0})
        </button>
        <button
          className={`pb-2 ${
            activeTab === "edit"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("edit")}
        >
          Edit Form
        </button>
      </div>

      {activeTab === "responses" ? (
        <>
          {/* Download button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm">
              ⬇ Download Data
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-6 border-b">
            {(["summary", "questions", "individual"] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-2 capitalize ${
                  subTab === tab
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sub-tab content */}
          {subTab === "summary" && (
            <div className="space-y-4">
              {formDetails?.responses?.length ? (
                formDetails.responses.map((r, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <p className="font-medium">Response {i + 1}</p>
                    <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(r, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No responses yet.</p>
              )}
            </div>
          )}

          {subTab === "questions" && (
            <QuestionsTab formId={id as string} token={token} />
          )}

          {subTab === "individual" && (
            <div className="p-4 space-y-6">
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">Respondent</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Mode</th>
                      <th className="px-6 py-3 text-left">Progress</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formDetails?.responses?.length ? (
                      formDetails.responses.map((r: ResponseItem, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-3">{r.respondent ?? "Anonymous"}</td>
                          <td className="px-6 py-3">
                            {r.date
                              ? new Date(r.date).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-3">{r.mode ?? "N/A"}</td>
                          <td className="px-6 py-3">
                            <span
                              className={
                                r.progress === "Completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                            >
                              {r.progress ?? "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-blue-600 underline cursor-pointer">
                            View more
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-3 text-center text-gray-500"
                        >
                          No responses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Showing 1 - {formDetails?.responses?.length ?? 0} results of{" "}
                  {formDetails?.responses?.length ?? 0}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Edit Form UI stays as before */
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <input
              className="w-full text-lg font-semibold px-4 py-3 border-b outline-none"
              placeholder="Form title"
              defaultValue={formDetails?.formName ?? ""}
            />
            <div className="flex items-center gap-2 px-4 py-2 border-b">
              <button className="text-gray-500">B</button>
              <button className="text-gray-500">I</button>
              <button className="text-gray-500">U</button>
              <button className="text-gray-500">🔗</button>
              <button className="text-gray-500">⛔</button>
            </div>
            <textarea
              className="w-full px-4 py-3 outline-none"
              placeholder="Form description"
            />
          </div>
        </div>
      )}
    </div>
  );
}
