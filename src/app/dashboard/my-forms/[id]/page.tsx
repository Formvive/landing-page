"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

export default function FormDetailPage() {
  const { id } = useParams();
//   const [activeTab, setActiveTab] = useState<"responses" | "edit">("responses");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read active tab from URL
  const activeTab = useMemo(() => searchParams.get("tab") || "responses", [searchParams]);

  const handleTabChange = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };
  // Dummy data for responses
  const responses = [
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Story", progress: "Completed" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Chat", progress: "In-Progress" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Story", progress: "Completed" },
    { respondent: "Somto Obienu", date: "19-June-2025", mode: "Chat", progress: "In-Progress" },
  ];

  return (
    <div className="p-6 space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/dashboard/my-forms" className="underline">My Forms</Link> &gt; Form {id}
      </nav>

      <h1 className="text-2xl font-semibold">Customer Survey Feedback</h1>

      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${activeTab === "responses" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("responses")}
        >
          Responses (0{responses.length})
        </button>
        <button
          className={`pb-2 ${activeTab === "edit" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("edit")}
        >
          Edit Form
        </button>
      </div>

      {activeTab === "responses" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm">
              ⬇ Download Data
            </button>
          </div>

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
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button className="bg-black text-white px-4 py-2 rounded text-sm">💾 Save</button>
            <button className="bg-black text-white px-4 py-2 rounded text-sm">🔗 Share</button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <input
              type="text"
              value="RESEARCH"
              className="w-full border-b text-xl font-semibold"
            />
            <textarea
              placeholder="Form description"
              className="w-full border-b resize-none"
            />
            <div className="p-4 border rounded">
              <p className="text-sm font-medium">What are the biggest challenges you face when making restaurant reservations in Nigeria?</p>
              <input type="text" placeholder="Long answer text" className="w-full mt-2 border-b" />
            </div>
            <div className="p-4 border rounded">
              <p className="text-sm font-medium">How often do you dine out in restaurants?</p>
              <div className="space-y-1 mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="dine" /> Always
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="dine" /> Sometimes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="dine" /> Never
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
