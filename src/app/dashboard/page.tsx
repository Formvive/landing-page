"use client";

import { useEffect, useState } from "react";
import "./page.css";
import "@/components/components.css";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import LineChart from "@/components/LineChart";
import DonutChart from "@/components/DonutChart";
import AgeDemographics from "@/components/AgeDemographics";
import { GetResponsesResponseBody, GetFormsResponseBody } from "@/types";
import { useRouter } from "next/navigation";

interface Form {
  id: string;
  formName: string;
  responseCount: number;
}

interface ResponseItem {
  id: string;
  formId: string;
  manuallyFilled: boolean;
  aiFilled: boolean;
  location?: string;
  age?: string;
  createdAt?: string;
}

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<Form[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // --- Dashboard State ---
  const [totalResponses, setTotalResponses] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [aiCount, setAiCount] = useState(0);
  const [locationData, setLocationData] = useState<{ name: string; value: number }[]>([]);
  const [ageData, setAgeData] = useState<Record<string, number>>({});
  const [trendData, setTrendData] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.warn("No token in localStorage. Aborting dashboard fetch.");
          setLoading(false);
          return;
        }

        // --- Get responses ---
        const resResponses = await fetch("https://form-vive-server.onrender.com/api/v1/user/responses", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!resResponses.ok) {
          const text = await resResponses.text().catch(() => "");
          console.error("Responses fetch failed:", resResponses.status, text);
        }

        const dataResponses: GetResponsesResponseBody | undefined = await resResponses.json().catch(() => undefined);
        const responses: ResponseItem[] = Array.isArray(dataResponses?.data) ? dataResponses!.data : [];

        // --- Totals ---
        const total = typeof dataResponses?.total === "number" ? dataResponses.total : responses.length;
        const manual = responses.filter((r: ResponseItem) => r.manuallyFilled).length;
        const ai = responses.filter((r: ResponseItem) => r.aiFilled).length;

        // --- Locations ---
        const locationMap: Record<string, number> = {};
        responses.forEach((r: ResponseItem) => {
          const loc = r.location ?? "Unknown";
          locationMap[loc] = (locationMap[loc] || 0) + 1;
        });
        const locationArr = Object.entries(locationMap).map(([name, count]) => ({
          name,
          value: Number(((count / (total || 1)) * 100).toFixed(1)),
        }));

        // --- Age ---
        const ageMap: Record<string, number> = {};
        responses.forEach((r: ResponseItem) => {
          const ageKey = r.age ?? "Unknown";
          ageMap[ageKey] = (ageMap[ageKey] || 0) + 1;
        });

        // --- Monthly Trends ---
        const monthMap: Record<string, number> = {};
        responses.forEach((r: ResponseItem) => {
          const date = r.createdAt ? new Date(r.createdAt) : null;
          const monthName = date && !isNaN(date.getTime()) ? date.toLocaleString("default", { month: "short" }) : "Unknown";
          monthMap[monthName] = (monthMap[monthName] || 0) + 1;
        });
        const trendArr = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

        // --- Get forms ---
        const resForms = await fetch("https://form-vive-server.onrender.com/api/v1/admin/forms", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!resForms.ok) {
          const text = await resForms.text().catch(() => "");
          console.error("Forms fetch failed:", resForms.status, text);
        }

        const dataForms: GetFormsResponseBody | undefined = await resForms.json().catch(() => undefined);
        const formsArr: Form[] = Array.isArray(dataForms?.data) ? dataForms!.data : [];

        // --- Update state ---
        setTotalResponses(total);
        setManualCount(manual);
        setAiCount(ai);
        setLocationData(locationArr);
        setAgeData(ageMap);
        setTrendData(trendArr);
        setForms(formsArr);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchForms() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("https://form-vive-server.onrender.com/api/v1/user/get-forms", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch forms", res.status);
          setForms([]);
          return;
        }

        const data: GetFormsResponseBody = await res.json();
        setForms(data.data || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    }

    fetchForms();
  }, [router]);

  // --- Pagination logic ---
  const totalPages = Math.ceil(forms.length / PAGE_SIZE);
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
