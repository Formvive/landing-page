"use client";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChart({ data }: { data: { month: string; count: number }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Responses Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#000" />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
