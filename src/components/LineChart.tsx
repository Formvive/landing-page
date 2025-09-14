"use client";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChart({ data }: { data: { month: string; count: number }[] }) {
  const isEmpty = !data || data.length === 0;
  const placeholderData = [
    { month: "Jan", count: 0 },
    { month: "Feb", count: 0 },
    { month: "Mar", count: 0 },
    { month: "Apr", count: 0 },
  ];

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Responses Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={isEmpty ? placeholderData : data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke={isEmpty ? "#d1d5db" : "#000"} // light gray if empty
            strokeDasharray={isEmpty ? "5 5" : undefined} // dashed for placeholder
          />
        </ReLineChart>
      </ResponsiveContainer>
      {isEmpty && (
        <p className="text-center text-gray-500 mt-4 italic">No responses yet</p>
      )}
    </div>
  );
}
