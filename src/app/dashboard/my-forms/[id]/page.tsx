"use client";

import * as XLSX from "xlsx";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SummaryTab from "@/components/SummaryTab";
import QuestionsTab from "@/components/QuestionsTab";
import EditFormTab from "@/components/editFormTab";
import ShareModal from "@/components/shareModal";
import { ResponseItem, Question, FormDetails, Answer } from "@/types";
import { getAuthToken } from "@/utils/authHelper";

/** Ensure ResponseWithAnswers always has an answers array */
type ResponseWithAnswers = ResponseItem & { answers: Answer[] };

// --- 1. Custom Hook for Data Fetching & Logic Separation ---
function useFormWithAnswers(formId: string, token: string | null) {
  const [data, setData] = useState<{
    form: FormDetails | null;
    questions: Question[];
  }>({ form: null, questions: [] });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !formId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const baseUrl = "https://form-vive-server.onrender.com/api/v1/user";

    async function fetchData() {
      try {
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        
        // Parallel fetching
        const [resForm, resQuestions, resAnswers] = await Promise.all([
          fetch(`${baseUrl}/get-singular-form/${encodeURIComponent(formId)}`, { headers }),
          fetch(`${baseUrl}/get-questions/${encodeURIComponent(formId)}`, { headers }),
          fetch(`${baseUrl}/get-answers/${encodeURIComponent(formId)}`, { headers }),
        ]);

        if (!resForm.ok || !resQuestions.ok || !resAnswers.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        const [formData, questionsData, answersData] = await Promise.all([
          resForm.json(),
          resQuestions.json(),
          resAnswers.json()
        ]);

        if (cancelled) return;

        // --- Data Stitching Logic ---
        const rawForm = formData.data;
        const rawQuestions = Array.isArray(questionsData.data) ? questionsData.data : [];
        const rawAnswers = Array.isArray(answersData.data) ? answersData.data : [];

        // Optimize: Create a Map for O(1) lookup instead of nested loops
        const answersMap = new Map<string, Answer[]>();
        rawAnswers.forEach((a: Answer) => {
          if (!a.responseId) return;
          const existing = answersMap.get(a.responseId) || [];
          existing.push(a);
          answersMap.set(a.responseId, existing);
        });

        // Attach answers to responses
        if (rawForm && Array.isArray(rawForm.responses)) {
          rawForm.responses = rawForm.responses.map((resp: ResponseItem) => ({
            ...resp,
            answers: answersMap.get(resp.id) || [],
          }));
        }

        setData({ form: rawForm, questions: rawQuestions });
      } catch (err: unknown) {
        if (!cancelled) {
          // Check if 'err' is a standard Error object to safely access .message
          const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
      }

    fetchData();

    return () => { cancelled = true; };
  }, [formId, token]);

  const updateLocalQuestions = useCallback((newQuestions: Question[]) => {
    setData((prev) => ({ ...prev, questions: newQuestions }));
  }, []);

  const updateLocalFormName = useCallback((newName: string) => {
    setData((prev) => (prev.form ? { ...prev, form: { ...prev.form, formName: newName } } : prev));
  }, []);

  return { ...data, loading, error, updateLocalQuestions, updateLocalFormName };
}

// --- 2. Main Component ---
export default function FormDetailPage() {
  const { id } = useParams();
  const formId = id as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const token = getAuthToken();
  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  // FIX 1: Alias 'error' to 'loadError' during destructuring
  const { 
    form: formDetails, 
    questions: formQuestions, 
    loading, 
    error: loadError,
    updateLocalQuestions,
    updateLocalFormName
  } = useFormWithAnswers(formId, token);

  const activeTab = useMemo(() => searchParams.get("tab") || "responses", [searchParams]);
  const [subTab, setSubTab] = useState<"summary" | "questions" | "individual">("summary");

  // FIX 2: Explicitly map responses to ensure 'answers' is never undefined
  // We create a specific type for the combined object to satisfy TypeScript
  const combinedFormDetails = useMemo(() => {
    if (!formDetails) return null;

    // We map over responses to strictly enforce that 'answers' is an array.
    // The 'as ResponseWithAnswers[]' cast tells TS "Trust me, I handled the undefined check."
    const strictResponses = (formDetails.responses || []).map((r) => ({
      ...r,
      answers: r.answers || [] 
    })) as ResponseWithAnswers[];

    return {
      ...formDetails,
      questions: formQuestions,
      responses: strictResponses,
    };
  }, [formDetails, formQuestions]);

  // --- Logic for Actions ---
  const handleDownload = (type: "csv" | "xlsx") => {
    if (!formDetails?.responses?.length) return alert("No responses to download.");

    const fileBase = (formDetails.formName || "form").replace(/\s+/g, "_").toLowerCase();
    
    // Prepare data
    const rows = formDetails.responses.map((resp: ResponseItem) => ({
      Location: resp.location ?? "N/A",
      Age: resp.age ?? "N/A",
      Date: resp.createdAt ? new Date(resp.createdAt).toLocaleString() : "N/A",
      Mode: resp.manuallyFilled ? "Manual" : resp.aiFilled ? "AI" : "N/A",
      Progress: resp.progress ?? "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    XLSX.writeFile(workbook, `${fileBase}_responses.${type}`, { bookType: type });
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  // --- Render ---
  if (loading) return <p className="p-6 text-gray-500">Loading form details...</p>;
  if (loadError) return <p className="p-6 text-red-500">Error: {loadError}</p>;
  if (!formDetails) return <p className="p-6 text-red-500">Failed to load form details.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/dashboard/my-forms" className="underline">My Forms</Link>
        {" "}&gt;&gt; {formDetails.formName ?? id}
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold">{formDetails.formName ?? "Untitled Form"}</h1>

      {/* Top-level tabs */}
      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${activeTab === "responses" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("responses")}
        >
          Responses ({formDetails.responses?.length ?? 0})
        </button>
        <button
          className={`pb-2 ${activeTab === "edit" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("edit")}
        >
          Edit Form
        </button>
      </div>

      {activeTab === "responses" ? (
        <>
          {/* Actions Bar */}
          <div className="flex justify-end gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
              🔗 Share
            </button>
            <button onClick={() => handleDownload("csv")} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm">
              ⬇ Download Data
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-6 border-b">
            {(["summary", "questions", "individual"] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-2 capitalize ${subTab === tab ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
                onClick={() => setSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Areas */}
          {subTab === "summary" && combinedFormDetails && (
            <SummaryTab formDetails={combinedFormDetails} />
          )}

          {subTab === "questions" && combinedFormDetails && (
            <QuestionsTab
              questions={combinedFormDetails.questions}
              responses={combinedFormDetails.responses}
            />
          )}

          {subTab === "individual" && (
            <div className="p-4 space-y-6">
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">Location</th>
                      <th className="px-6 py-3 text-left">Age</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Mode</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formDetails.responses?.length ? (
                      formDetails.responses.map((r, idx) => (
                        <tr key={r.id ?? idx} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-3">{r.location || "N/A"}</td>
                          <td className="px-6 py-3">{r.age || "N/A"}</td>
                          <td className="px-6 py-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A"}</td>
                          <td className="px-6 py-3">{r.manuallyFilled ? "Manual" : r.aiFilled ? "AI" : "N/A"}</td>
                          <td className="px-6 py-3 text-black underline">
                            <Link href={`/dashboard/my-forms/${formId}/individual`}>View more</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-3 text-center text-gray-500">No responses yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Edit Tab */
        combinedFormDetails && (
          <EditFormTab 
            formDetails={combinedFormDetails} 
            questions={combinedFormDetails.questions}
            token={token} 
            onUpdateQuestions={updateLocalQuestions} 
            onUpdateFormName={updateLocalFormName}
          />
        )
      )}

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)}
        formId={formId}
        formName={formDetails.formName}
      />
    </div>
  );
}