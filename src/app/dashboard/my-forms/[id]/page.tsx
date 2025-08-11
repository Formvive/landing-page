"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function FormDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = useMemo(() => searchParams.get("tab") || "responses", [searchParams]);
  const [subTab, setSubTab] = useState<"summary" | "questions" | "individual">("summary");

  const handleTabChange = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  // Dummy data (replace with API call)
  const questions = [
    {
      question: "What are the biggest challenges you face when making restaurant reservations in Nigeria?",
      responses: ["-", "No network"],
      chart: null
    },
    {
      question: "How often do you dine out in restaurants?",
      responses: [],
      chart: { type: "pie", data: [100], labels: ["Always"] }
    }
    // ...add more from your screenshot
  ];

  // Dummy data for responses
  const responses = [
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Story", progress: "Completed" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Chat", progress: "In-Progress" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Story", progress: "Completed" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Chat", progress: "In-Progress" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/dashboard/my-forms" className="underline">My Forms</Link> &gt; Form {id}
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold">Customer Survey Feedback</h1>

      {/* Top-level tabs */}
      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${activeTab === "responses" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("responses")}
        >
          Responses (08)
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
          {/* Download button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm">
              ⬇ Download Data
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-6 border-b">
          {(["summary", "questions", "individual"] as const).map(tab => (
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
          
          {subTab === "summary" && (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <p className="font-medium">{q.question}</p>
                  {q.chart ? (
                    <div className="flex justify-center items-center py-6">
                      {/* Replace with real chart later */}
                      <div className="w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center">
                        {q.chart.data[0]}%
                      </div>
                    </div>
                  ) : (
                    q.responses.map((r, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">{r}</div>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}

          {subTab === "questions" && (
            <div className="p-4 space-y-6">
              {/* Question 1 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  What are your biggest challenges at work?
                </h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    &quot;Communication between teams&quot;
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    &quot;Meeting tight deadlines&quot;
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    &quot;Lack of resources for projects&quot;
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  What tools do you use most frequently?
                </h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    &quot;Slack, Notion, and Trello&quot;
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    &quot;Figma and Google Docs&quot;
                  </div>
                </div>
              </div>
            </div>
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
                    {responses.map((r, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">{r.respondent}</td>
                        <td className="px-6 py-3">{r.date}</td>
                        <td className="px-6 py-3">{r.mode}</td>
                        <td className="px-6 py-3">
                          <span className={r.progress === "Completed" ? "text-green-600" : "text-yellow-600"}>
                            {r.progress}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-blue-600 underline cursor-pointer">View more</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Showing 1 - {responses.length} results of {responses.length}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-gray-200">⏪</button>
                  <select className="border rounded px-1 py-0.5 text-xs">
                    <option>01</option>
                  </select>
                  <button className="p-1 rounded hover:bg-gray-200">⏩</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Edit Form UI stays as you wrote it */
        <div className="space-y-4">
          {/* Title & description */}
          <div className="border rounded-lg overflow-hidden">
            <input
              className="w-full text-lg font-semibold px-4 py-3 border-b outline-none"
              placeholder="Form title"
              defaultValue="RESEARCH"
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

          {/* Questions */}
          <div className="border rounded-lg p-4">
            <p className="mb-2">
              What are the biggest challenges you face when making restaurant reservations in Nigeria?
            </p>
            <input
              className="w-full border-b outline-none pb-1"
              placeholder="Long answer text"
            />
          </div>

          <div className="border rounded-lg p-4">
            <p className="mb-2">How often do you dine out in restaurants?</p>
            <div className="space-y-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="q2" /> Always
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="q2" /> Sometimes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="q2" /> Never
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
