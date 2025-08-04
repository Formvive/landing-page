"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface SignupPoint {
  date: string;
  signups: number;
}

export interface SignupsChartProps {
  data: SignupPoint[];
}

const SignupsChart: React.FC<SignupsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid stroke="#2a2e42" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#9ca3af" }}
          axisLine={{ stroke: "#2a2e42" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9ca3af" }}
          axisLine={{ stroke: "#2a2e42" }}
          tickLine={false}
          domain={["dataMin", "dataMax"]}
        />
        <Tooltip
          contentStyle={{
            background: "#1f2233",
            border: "none",
            color: "#fff",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="signups"
          stroke="#a78bfa"
          strokeWidth={3}
          dot={false}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SignupsChart;
