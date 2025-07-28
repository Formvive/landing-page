import './page.css';
import "@/components/components.css";
import StatCard from "@/components/StatCard";
import LineChart from "@/components/LineChart";
import DonutChart from "@/components/DonutChart";
import AgeDemographics from "@/components/AgeDemographics";

export default function DashboardPage() {
  return (
    <>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <StatCard title="Total Responses" value="7,265" change="+11.01%" bg="EDEEFC"/>
          <StatCard title="Manually filled Responses" value="3,671" change="-0.03%" bg="E6F1FD"/>
          <StatCard title="AI-Predicted Responses" value="2,318" change="+6.08%" bg="E6F1FD"/>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <LineChart />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <AgeDemographics />
          </div>
        </section>
        <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
          <DonutChart />
        </section>
    </>
  );
}
