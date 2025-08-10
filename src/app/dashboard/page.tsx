"use client";

import { useEffect, useState } from "react";
import './page.css';
import "@/components/components.css";
import StatCard from "@/components/StatCard";
import LineChart from "@/components/LineChart";
import DonutChart from "@/components/DonutChart";
import AgeDemographics from "@/components/AgeDemographics";
import { GetResponsesResponseBody, GetFormsResponseBody, 
  // ResponseItem,
   FormResponse } from "@/types"; // adjust path

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // --- Dashboard State ---
  const [totalResponses, setTotalResponses] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [aiCount, setAiCount] = useState(0);
  const [locationData, setLocationData] = useState<{ name: string; value: number }[]>([]);
  const [ageData, setAgeData] = useState<Record<string, number>>({});
  const [trendData, setTrendData] = useState<{ month: string; count: number }[]>([]);
  const [forms, setForms] = useState<FormResponse[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // --- Get responses ---
        const resResponses = await fetch("https://form-vive-server.onrender.com/api/v1/admin/responses");
        console.log(resResponses)
        const dataResponses: GetResponsesResponseBody = await resResponses.json();
        const responses = dataResponses.data;

        // --- Totals ---
        const total = dataResponses.total;
        const manual = responses.filter(r => r.manuallyFilled).length;
        const ai = responses.filter(r => r.aiFilled).length;

        // --- Locations ---
        const locationMap: Record<string, number> = {};
        responses.forEach(r => {
          locationMap[r.location || "Unknown"] = (locationMap[r.location || "Unknown"] || 0) + 1;
        });
        const locationArr = Object.entries(locationMap).map(([name, count]) => ({
          name,
          value: Number(((count / total) * 100).toFixed(1))
        }));

        // --- Age ---
        const ageMap: Record<string, number> = {};
        responses.forEach(r => {
          ageMap[r.age || "Unknown"] = (ageMap[r.age || "Unknown"] || 0) + 1;
        });

        // --- Monthly Trends ---
        const monthMap: Record<string, number> = {};
        responses.forEach(r => {
          const date = new Date(r.createdAt);
          const monthName = date.toLocaleString("default", { month: "short" });
          monthMap[monthName] = (monthMap[monthName] || 0) + 1;
        });
        const trendArr = Object.entries(monthMap).map(([month, count]) => ({
          month,
          count
        }));

        // --- Get forms ---
        const resForms = await fetch("https://form-vive-server.onrender.com/api/v1/admin/forms");
        console.log(resForms)
        const dataForms: GetFormsResponseBody = await resForms.json();

        // --- Update state ---
        setTotalResponses(total);
        setManualCount(manual);
        setAiCount(ai);
        setLocationData(locationArr);
        setAgeData(ageMap);
        setTrendData(trendArr);
        setForms(dataForms.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

      {/* --- Optional Forms Section --- */}
      <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Forms</h3>
        <ul className="space-y-2 text-sm">
          {forms.map(form => (
            <li key={form.id} className="flex justify-between">
              <span>{form.formName}</span>
              <span>{form.responseCount} responses</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
