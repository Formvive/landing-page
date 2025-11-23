"use client";

import { useEffect, useState } from "react";
import "./page.css";
import "@/components/components.css";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import LineChart from "@/components/LineChart";
import DonutChart from "@/components/DonutChart";
import AgeDemographics from "@/components/AgeDemographics";
import { GetFormsResponseBody } from "@/types";
import { useRouter } from "next/navigation";
// import { getAuthToken } from "@/utils/authHelper";

interface Form {
  id: string;
  formName: string;
  responseCount: number;
  responses?: ResponseItem[];
}

interface ResponseItem {
  id: string;
  formId: string;
  manuallyFilled: boolean;
  aiFilled: boolean;
  location?: string;
  age?: string;
  createdAt?: string;
  // any other fields...
}

const PAGE_SIZE = 10;

// --- Utilities for time grouping (month keys/labels) ---
function safeDate(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function monthKey(dateStr?: string | null, tz = "Africa/Lagos") {
  const dt = safeDate(dateStr);
  if (!dt) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
    }).formatToParts(dt);
    const year = parts.find((p) => p.type === "year")!.value;
    const month = parts.find((p) => p.type === "month")!.value;
    return `${year}-${month}`; // "2025-08"
  } catch {
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
}

function monthLabelFromKey(key: string) {
  // key expected "YYYY-MM"
  const [y, m] = key.split("-");
  const monthIndex = Number(m) - 1;
  const dt = new Date(Number(y), monthIndex, 1);
  return dt.toLocaleString("default", { month: "short", year: "numeric" }); // "Aug 2025"
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<Form[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // const token = getAuthToken();

  // --- Dashboard State ---
  const [totalResponses, setTotalResponses] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [aiCount, setAiCount] = useState(0);
  const [locationData, setLocationData] = useState<{ name: string; value: number }[]>([]);
  const [ageData, setAgeData] = useState<Record<string, number>>({});
  const [trendData, setTrendData] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchAndParse() {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        // no token -> redirect to login
        console.log("missing token");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("https://form-vive-server.onrender.com/api/v1/user/get-forms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        });

        if (!res.ok) {
          console.log(res);
          const text = await res.text().catch(() => "");
          console.error("Failed to fetch forms:", res.status, text);
          setForms([]);
          setTotalResponses(0);
          setLocationData([]);
          setAgeData({});
          setTrendData([]);
          setManualCount(0);
          setAiCount(0);
          return;
        }

        const body: GetFormsResponseBody = await res.json();

        // --- Flatten all responses from all forms ---
        const allResponses: ResponseItem[] = (body.data || []).flatMap((form) =>
        (Array.isArray(form.responses) ? form.responses : []).map((r) => ({
          ...r,
          formName: form.formName,
          formId: form.id,
        }))
      );

        // --- Totals ---
        const total = allResponses.length;
        const manual = allResponses.filter((r) => r.manuallyFilled).length;
        const ai = allResponses.filter((r) => r.aiFilled).length;

        // --- Locations: aggregated as counts (DonutChart usually wants {name, value}) ---
        const locationMap: Record<string, number> = {};
        allResponses.forEach((r) => {
          const loc = r.location ?? "Unknown";
          locationMap[loc] = (locationMap[loc] || 0) + 1;
        });
        const locationArr = Object.entries(locationMap).map(([name, count]) => ({ name, value: count }));

        // --- Age map (raw counts) ---
        const ageMap: Record<string, number> = {};
        allResponses.forEach((r) => {
          const ageKey = r.age ?? "Unknown";
          ageMap[ageKey] = (ageMap[ageKey] || 0) + 1;
        });

        // --- Monthly Trends: count per YYYY-MM, then convert to sorted array with friendly labels ---
        const monthMap: Record<string, number> = {};
        allResponses.forEach((r) => {
          const mk = monthKey(r.createdAt) ?? "Unknown";
          monthMap[mk] = (monthMap[mk] || 0) + 1;
        });

        // convert monthMap -> array, sort chronologically (Unknown last)
        const trendArr = Object.entries(monthMap)
          .map(([key, count]) => ({ key, count }))
          .sort((a, b) => {
            if (a.key === "Unknown") return 1;
            if (b.key === "Unknown") return -1;
            // compare YYYY-MM lexicographically works
            return a.key.localeCompare(b.key);
          })
          .map((item) => ({
            month: item.key === "Unknown" ? "Unknown" : monthLabelFromKey(item.key),
            count: item.count,
          }));

        // --- Forms for list UI ---
        const formsArr: Form[] = (body.data || []).map((f) => ({
          id: f.id,
          formName: f.formName,
          responseCount: typeof f.responseCount === "number"
            ? f.responseCount
            : (Array.isArray(f.responses) ? f.responses.length : 0),
          responses: f.responses,
        }));

        // --- Update state ---
        setForms(formsArr);
        setTotalResponses(total);
        setManualCount(manual);
        setAiCount(ai);
        setLocationData(locationArr);
        setAgeData(ageMap);
        setTrendData(trendArr);
      } catch (err) {
        console.error("Failed to fetch/parsing dashboard data:", err);
        setForms([]);
        setTotalResponses(0);
        setManualCount(0);
        setAiCount(0);
        setLocationData([]);
        setAgeData({});
        setTrendData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAndParse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Pagination logic ---
  const totalPages = Math.max(1, Math.ceil(forms.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentForms = forms.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      {/* --- Stat Cards --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <StatCard title="Total Responses" value={totalResponses.toString()} change="+11.01%" bg="EDEEFC" />
        <StatCard title="Manually filled Responses" value={manualCount.toString()} change="-0.03%" bg="E6F1FD" />
        <StatCard title="AI-Predicted Responses" value={aiCount.toString()} change="+6.08%" bg="E6F1FD" />
      </section>

      {/* --- Charts --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <LineChart data={trendData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <AgeDemographics data={ageData} />
        </div>
      </section>

      <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
        <DonutChart data={locationData} />
      </section>

      {/* --- Forms Section --- */}
      <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Forms</h3>
        {forms.length === 0 ? (
          <p className="text-gray-500 text-sm">No forms available</p>
        ) : (
          <>
            <ul className="space-y-2 text-sm">
              {currentForms.map((form) => (
                <Link href={`/dashboard/my-forms/${form.id}`} key={form.id}>
                  <li className="flex justify-between items-center border-b last:border-none border-gray-100 py-2">
                    <span className="font-medium">{form.formName}</span>
                    <span className="text-gray-500">{form.responseCount} responses</span>
                  </li>
                </Link>
              ))}
            </ul>

            {/* Pagination Controls */}
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
          </>
        )}
      </section>
    </>
  );
}
