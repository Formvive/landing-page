"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", thisYear: 10000, lastYear: 12000 },
  { month: "Feb", thisYear: 8000, lastYear: 15000 },
  { month: "Mar", thisYear: 11000, lastYear: 18000 },
  { month: "Apr", thisYear: 16000, lastYear: 20000 },
  { month: "May", thisYear: 22000, lastYear: 25000 },
  { month: "Jun", thisYear: 17000, lastYear: 23000 },
  { month: "Jul", thisYear: 20000, lastYear: 28000 },
];

export default function UserLineChart() {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Total Users</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="thisYear" stroke="#000" />
          <Line type="monotone" dataKey="lastYear" stroke="#8884d8" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
