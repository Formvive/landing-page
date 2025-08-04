"use client";

import { FC } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ------------------------------
// 1. TYPES
// ------------------------------

// Generic type for any small chart–driving array.
// Keys are column names; values are either string or number.
export type DataPoint = Record<string, string | number>;

export interface Metric {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  subText?: string;

  // Optional spark chart at the bottom of the card:
  chart?: "line" | "bar";

  // Data for that spark chart:
  data?: DataPoint[];
  dataKey?: string;
}

// ------------------------------
// 2. MOCK DATA
// ------------------------------

// 2.1 User & Account Metrics
const userMetrics: Metric[] = [
  {
    title: "Total Signups",
    value: "2.0K",
    chart: "line",
    dataKey: "signups",
    data: [
      { date: "Jun", signups: 150 },
      { date: "Jul", signups: 280 },
      { date: "Aug", signups: 340 },
      { date: "Sep", signups: 420 },
    ],
  },
  { title: "Active Users (7d)", value: "1.2K" },
  { title: "Active Users (30d)", value: "1.8K" },
  { title: "Waitlist Signups", value: "500" },
  { title: "Conversion Rate", value: "25%", delta: "↑5%", deltaPositive: true },
];

const signupsByRegion = [
  { name: "North America", value: 800 },
  { name: "Europe",        value: 600 },
  { name: "Asia",          value: 400 },
  { name: "Other",         value: 200 },
];

const signupsByDevice = [
  { name: "Desktop", value: 1200 },
  { name: "Mobile",  value: 800 },
];

// 2.2 Formvive Usage Stats
const usageStats: Metric[] = [
  { title: "Total Forms Created", value: "5.9K" },
  {
    title: "Forms Created Per Week",
    value: "",
    chart: "bar",
    dataKey: "forms",
    data: [
      { week: "W1", forms: 300 },
      { week: "W2", forms: 450 },
      { week: "W3", forms: 600 },
      { week: "W4", forms: 720 },
    ],
  },
  { title: "Forms Shared",       value: "1.1K" },
  { title: "With Responses",     value: "3.2K", subText: "vs 2.7K without" },
  { title: "Top Form Type",      value: "Standard" },
];

// 2.3 Engagement & Interaction
const engagementMetrics: Metric[] = [
  { title: "Form Completion Rate",   value: "89%" },
  { title: "Avg Time to Complete",   value: "00:07:32" },
  { title: "Form Abandonment Rate",  value: "11%" },
  { title: "View-to-Response Ratio", value: "4:1" },
];

const interactionModes = [
  { name: "Chat",  value: 40 },
  { name: "Swipe", value: 35 },
  { name: "Story", value: 25 },
];

// ------------------------------
// 3. COMPONENTS
// ------------------------------

const MetricCard: FC<Metric> = ({
  title,
  value,
  delta,
  deltaPositive,
  subText,
  chart,
  data,
  dataKey,
}) => (
  <div className="bg-slate-900 rounded-2xl p-5 flex flex-col justify-between shadow-md min-w-[180px]">
    {/* header */}
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-300 font-medium">{title}</div>
      <svg
        width="16"
        height="16"
        fill="none"
        className="text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    {/* value & delta */}
    <div className="mt-3 flex items-baseline gap-2">
      <div className="text-2xl font-semibold">{value}</div>
      {delta && (
        <div
          className={`text-sm font-medium flex items-center gap-1 ${
            deltaPositive ? "text-green-400" : "text-rose-500"
          }`}
        >
          {deltaPositive ? "↑" : "↓"}
          {delta.replace(/[↑↓]/, "")}
        </div>
      )}
    </div>

    {/* subText */}
    {subText && <div className="text-xs text-slate-500 mt-1">{subText}</div>}

    {/* spark chart */}
    {chart === "line" && data && dataKey && (
      <ResponsiveContainer width="100%" height={50} className="mt-2">
        <LineChart data={data as DataPoint[]}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
    {chart === "bar" && data && dataKey && (
      <ResponsiveContainer width="100%" height={50} className="mt-2">
        <BarChart data={data as DataPoint[]}>
          <Bar dataKey={dataKey} barSize={8} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
const SimplePie: FC<{ data: { name: string; value: number }[]; title: string }> = ({
  data,
  title,
}) => (
  <div className="bg-slate-900 rounded-2xl p-5 shadow-md">
    <div className="text-sm text-slate-300 font-medium mb-2">{title}</div>
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={60} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={20} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// ------------------------------
// 4. PAGE
// ------------------------------

const DashboardPage: FC = () => (
  <div className="min-h-screen w-full bg-[#0f111a] text-white p-6 space-y-8">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>

    {/* User & Account Metrics */}
    <section>
      <h2 className="text-xl font-semibold mb-4">User & Account Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {userMetrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SimplePie data={signupsByRegion} title="Signups by Region" />
        <SimplePie data={signupsByDevice} title="Signups by Device" />
      </div>
    </section>

    {/* Formvive Usage Stats */}
    <section>
      <h2 className="text-xl font-semibold mb-4">Formvive Usage Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {usageStats.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>
    </section>

    {/* Engagement & Interaction */}
    <section>
      <h2 className="text-xl font-semibold mb-4">Engagement & Interaction</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {engagementMetrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>
      <div className="mt-6">
        <SimplePie data={interactionModes} title="Popular Interaction Modes" />
      </div>
    </section>
  </div>
);

export default DashboardPage;
