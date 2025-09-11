import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FormDetails } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryTab({ formDetails }: { formDetails: FormDetails }) {
  if (!formDetails?.questions?.length) {
    return <p className="text-gray-500">No questions yet.</p>;
  }

  return (
    <div className="space-y-6">
      {formDetails.questions.map((q) => {
        // 🔹 Mock some placeholder answers so the UI looks alive
        let answers: string[] = [];

        if (q.type === "MULTIPLE_CHOICE") {
          // Pretend users picked some options
          answers = ["Option A", "Option B", "Option A", "Option C", "Option D", "Option C"];

          const counts: Record<string, number> = {};
          answers.forEach((val) => {
            counts[val] = (counts[val] || 0) + 1;
          });

          const data = {
            labels: Object.keys(counts),
            datasets: [
              {
                data: Object.values(counts),
                backgroundColor: ["#EF4444", "#3B82F6", "#F59E0B", "#10B981"],
              },
            ],
          };

          return (
            <div key={q.id} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{q.text}</p>
              <p className="text-sm text-gray-500 mb-4">
                {answers.length} responses
              </p>
              <Pie data={data} />
            </div>
          );
        } else {
          // Pretend users gave short text answers
          answers = [
            "I think this is a great feature!",
            "Needs improvement in speed.",
            "Very useful for my work.",
          ];

          return (
            <div key={q.id} className="border rounded-lg p-4 space-y-2">
              <p className="font-medium">{q.text}</p>
              <p className="text-sm text-gray-500">
                {answers.length} responses
              </p>
              {answers.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded p-2 text-sm"
                >
                  {val}
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}

export default SummaryTab;