"use client";

import * as XLSX from "xlsx";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import SummaryTab from "@/components/SummaryTab";
import QuestionsTab from "@/components/QuestionsTab";
import { ResponseItem, Question, FormDetails, Answer } from "@/types";

/** Ensure ResponseWithAnswers always has an answers array */
type ResponseWithAnswers = ResponseItem & { answers: Answer[] };

export default function FormDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = useMemo(() => searchParams.get("tab") || "responses", [searchParams]);
  const [subTab, setSubTab] = useState<"summary" | "questions" | "individual">("summary");

  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [formQuestions, setFormQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- typed fetch response shapes ---
  type GetSingularFormResponse = { data: FormDetails | null };
  type GetQuestionsResponse = { data: Question[] | null };
  type GetAnswersResponse = { data: Answer[] | null };

  // Download CSV/XLSX of responses
  const handleDownload = (type: "csv" | "xlsx") => {
    if (!formDetails?.responses?.length) {
      // consider replacing alert with a toast
      alert("No responses to download.");
      return;
    }

    const fileBase = (formDetails.formName || "form").replace(/\s+/g, "_").toLowerCase();
    const rows = (formDetails.responses || []).map((resp: ResponseItem) => ({
      Location: resp.location ?? "N/A",
      Age: resp.age ?? "N/A",
      Date: resp.createdAt ? new Date(resp.createdAt).toLocaleString() : "N/A",
      Mode: resp.manuallyFilled ? "Manual" : resp.aiFilled ? "AI" : "N/A",
      Progress: resp.progress ?? "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    const filename = `${fileBase}_responses.${type === "csv" ? "csv" : "xlsx"}`;
    XLSX.writeFile(workbook, filename, { bookType: type === "csv" ? "csv" : "xlsx" });
  };

  // Copy share link
  const handleShare = async () => {
    try {
      const idToShare = formDetails?.id ?? formId;
      const link = `${window.location.origin}/fill/${idToShare}`;
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  const handleTabChange = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  // combined: questions + responses (with answers attached and normalized)
  const combinedFormDetails: FormDetails | null =
    formDetails
      ? {
          formName: formDetails.formName,
          id: formDetails.id,
          questions: formQuestions,
          responses: (formDetails.responses || []) as ResponseWithAnswers[],
        }
      : null;

  // read token once
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const formId = id as string;

  useEffect(() => {
    if (!token || !formId) return;

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    const singularUrl = `https://form-vive-server.onrender.com/api/v1/user/get-singular-form/${encodeURIComponent(formId)}`;
    const questionsUrl = `https://form-vive-server.onrender.com/api/v1/user/get-questions/${encodeURIComponent(formId)}`;
    const answersUrl = `https://form-vive-server.onrender.com/api/v1/user/get-answers/${encodeURIComponent(formId)}`;

    (async () => {
      try {
        const [resForm, resQuestions, resAnswers] = await Promise.all([
          fetch(singularUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          fetch(questionsUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          fetch(answersUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ]);

        if (!resForm.ok) {
          const t = await resForm.text().catch(() => "");
          throw new Error(`get-singular-form failed: ${resForm.status} ${t}`);
        }
        if (!resQuestions.ok) {
          const t = await resQuestions.text().catch(() => "");
          throw new Error(`get-questions failed: ${resQuestions.status} ${t}`);
        }
        if (!resAnswers.ok) {
          const t = await resAnswers.text().catch(() => "");
          throw new Error(`get-answers failed: ${resAnswers.status} ${t}`);
        }

        // parse JSON with explicit types
        const formJson = (await resForm.json()) as GetSingularFormResponse;
        const questionsJson = (await resQuestions.json()) as GetQuestionsResponse;
        const answersJson = (await resAnswers.json()) as GetAnswersResponse;

        if (cancelled) return;

        const singularData = formJson?.data ?? null;
        const questionsData: Question[] = Array.isArray(questionsJson?.data) ? questionsJson.data : [];
        const answersData: Answer[] = Array.isArray(answersJson?.data) ? answersJson.data : [];

        // Build answers map grouped by responseId
        const answersByResponse: Record<string, Answer[]> = {};
        for (const a of answersData) {
          if (!a || !a.responseId) continue;
          if (!answersByResponse[a.responseId]) answersByResponse[a.responseId] = [];
          answersByResponse[a.responseId].push(a);
        }

        // Attach answers (normalized to array) to each response
        if (singularData && Array.isArray(singularData.responses)) {
          singularData.responses = singularData.responses.map((resp: ResponseItem) => ({
            ...resp,
            answers: answersByResponse[resp.id] ?? [],
          }));
        }

        setFormDetails(singularData);
        setFormQuestions(questionsData);
      } catch (err: unknown) {
        console.error("Failed to fetch data", err);
        const message = err instanceof Error ? err.message : "Unknown error";
        setLoadError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, formId]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading form details...</p>;
  }

  if (loadError) {
    return <p className="p-6 text-red-500">Error: {loadError}</p>;
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
        </Link>{" "}
        &gt;&gt; {formDetails.formName ?? id}
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold">{formDetails.formName ?? "Untitled Form"}</h1>

      {/* Top-level tabs */}
      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${
            activeTab === "responses" ? "border-b-2 border-black font-semibold" : "text-gray-500"
          }`}
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
          {/* Buttons row */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50"
            >
              🔗 Share
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm"
            >
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

          {/* Sub-tab content */}
          {subTab === "summary" && combinedFormDetails && <SummaryTab formDetails={combinedFormDetails} />}

          {subTab === "questions" && (
            <QuestionsTab
              questions={combinedFormDetails?.questions ?? []}
              responses={(combinedFormDetails?.responses ?? []).map((r) => ({ ...r, answers: r.answers ?? [] }))}
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
                        <td colSpan={5} className="px-6 py-3 text-center text-gray-500">
                          No responses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <input className="w-full text-lg font-semibold px-4 py-3 border-b outline-none" placeholder="Form title" defaultValue={formDetails.formName ?? ""} />
            <div className="flex items-center gap-2 px-4 py-2 border-b">
              <button className="text-gray-500">B</button>
              <button className="text-gray-500">I</button>
              <button className="text-gray-500">U</button>
              <button className="text-gray-500">🔗</button>
              <button className="text-gray-500">⛔</button>
            </div>
            <textarea className="w-full px-4 py-3 outline-none" placeholder="Form description" />
          </div>
        </div>
      )}
    </div>
  );
}
