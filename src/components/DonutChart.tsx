"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#000000", "#A7D8DE", "#34D399", "#CBD5E1"];

export default function DonutChart({ data }: { data: { name: string; value: number }[] })  {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Responses by Location</h3>
      <div className="flex flex-row">
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        <ul className="mt-4 space-y-1 text-sm">
            {data.map((d) => (
            <li key={d.name} className="flex justify-between">
                <span>{d.name}</span>
                <span>{d.value}%</span>
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
