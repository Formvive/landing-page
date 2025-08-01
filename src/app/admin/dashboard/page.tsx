import { FC } from "react";
import SignupsChart from "@/components/SignUpsChart";

interface Metric {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  subText?: string;
  verified?: boolean;
}

// interface SiteActivity {
//   topicsLast7Days: number;
//   postsToday: number;
//   activeUsers7Days: number;
//   signups7Days: number;
//   likesAllTime: number;
//   chatMessages7Days: number;
// }

const metricData: Metric[] = [
  {
    title: "Verified followers",
    value: "1.3K / 5.9K",
    subText: undefined,
    verified: true,
  },
  {
    title: "Impressions",
    value: "9.5M",
    delta: "↑406K%",
    deltaPositive: true,
  },
  {
    title: "Engagement rate",
    value: "2.1%",
    delta: "↓74%",
    deltaPositive: false,
  },
  {
    title: "Engagements",
    value: "203.7K",
    delta: "↑105K%",
    deltaPositive: true,
  },
  {
    title: "Profile visits",
    value: "66.8K",
    delta: "↑215K%",
    deltaPositive: true,
  },
  {
    title: "Replies",
    value: "9K",
    delta: "↑56K%",
    deltaPositive: true,
  },
  {
    title: "Likes",
    value: "47K",
    delta: "↑114K%",
    deltaPositive: true,
  },
  {
    title: "Reposts",
    value: "1.4K",
    delta: "↑143K%",
    deltaPositive: true,
  },
  {
    title: "Bookmarks",
    value: "12.9K",
    delta: "↑1M%",
    deltaPositive: true,
  },
  {
    title: "Shares",
    value: "485",
    delta: "↑6K%",
    deltaPositive: true,
  },
];

// Mock signups chart data
const signupsChartData = [
  { date: "Jun 8", signups: 5 },
  { date: "Jun 15", signups: 60 },
  { date: "Jun 22", signups: 220 },
  { date: "Jun 29", signups: 450 },
  { date: "Jul 6", signups: 720 },
  { date: "Jul 13", signups: 1000 },
  { date: "Jul 20", signups: 1400 },
  { date: "Jul 25", signups: 2022 },
];

// const siteActivity: SiteActivity = {
//   topicsLast7Days: 32,
//   postsToday: 556,
//   activeUsers7Days: 475,
//   signups7Days: 477,
//   likesAllTime: 71,
//   chatMessages7Days: 110,
// };

const MetricCard: FC<Metric> = ({
  title,
  value,
  delta,
  deltaPositive,
  subText,
  verified,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 flex flex-col justify-between shadow-md min-w-[180px]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-300 font-medium flex items-center gap-1">
          {title}
          {verified && (
            <span className="text-blue-400 text-xs font-bold">✔︎</span>
          )}
        </div>
        <div>
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
      </div>
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
      {subText && <div className="text-xs text-slate-500 mt-1">{subText}</div>}
    </div>
  );
};

const ActivityItem: FC<{ label: string; value: string | number; note?: string }> =
  ({ label, value, note }) => {
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="bg-slate-700 rounded-full p-2">
            <span className="sr-only">{label} icon</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-slate-200">{label}</div>
          <div className="text-lg font-semibold text-white">{value}</div>
          {note && <div className="text-xs text-slate-500">{note}</div>}
        </div>
      </div>
    );
  };

const DashboardPage: FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#0f111a] text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {metricData.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            delta={m.delta}
            deltaPositive={m.deltaPositive}
            subText={m.subText}
            verified={m.verified}
          />
        ))}
      </div>

      {/* Bottom section: site activity + signups chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signups chart card */}
        <div className="col-span-2 bg-slate-900 rounded-2xl p-6 shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-slate-300 font-medium flex items-center gap-1">
                Total sign-ups
                <div className="text-xs text-slate-400">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block"
                  >
                    <circle cx="7" cy="7" r="6" />
                    <path d="M7 4v2M7 8v2" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-semibold mt-1">2,022</div>
              <div className="text-xs text-slate-500">All time</div>
            </div>
            <div className="text-xs text-slate-400">Updated seconds ago</div>
          </div>
          <div className="flex-1">
            <SignupsChart data={signupsChartData} />
          </div>
          <div className="mt-4 flex justify-end">
            <div className="text-sm text-slate-400 cursor-pointer hover:underline">
              View all users &rarr;
            </div>
          </div>
        </div>

        {/* Site activity card */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-md flex flex-col">
          <div className="text-xl font-semibold mb-2">Site activity</div>
          <div className="grid grid-cols-1 gap-4">
            <ActivityItem
              label="32 topics"
              value="in the last 7 days"
              note=""
            />
            <ActivityItem label="556 posts" value="today" />
            <ActivityItem
              label="475 active users"
              value="in the last 7 days"
            />
            <ActivityItem
              label="477 sign-ups"
              value="in the last 7 days"
            />
            <ActivityItem label="71 likes" value="all time" />
            <ActivityItem
              label="110 chat messages"
              value="in the last 7 days"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
