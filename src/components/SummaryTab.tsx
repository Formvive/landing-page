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
  const { questions = [], responses = [] } = formDetails || {};

  // if there are no responses at all
  if (!responses.length) {
    return <p className="text-gray-500">No responses yet.</p>;
  }

  if (!questions.length) {
    return <p className="text-gray-500">No questions yet.</p>;
  }

  return (
    <div className="space-y-6">
      {questions.map((q) => {
        // collect all answers for this question
        const allAnswers = responses
          .flatMap((resp) => resp.answers || [])
          .filter((a) => a.questionId === q.id)
          .map((a) => a.value);

        if (!allAnswers.length) {
          return (
            <div key={q.id} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{q.text}</p>
              <p className="text-sm text-gray-500 mb-2">No responses yet.</p>
            </div>
          );
        }

        if (q.type === "MULTIPLE_CHOICE") {
          const counts: Record<string, number> = {};
          allAnswers.forEach((val) => {
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
                {allAnswers.length} responses
              </p>
              <Pie data={data} />
            </div>
          );
        }

        // for short/open text
        return (
          <div key={q.id} className="border rounded-lg p-4 space-y-2">
            <p className="font-medium">{q.text}</p>
            <p className="text-sm text-gray-500">{allAnswers.length} responses</p>
            {allAnswers.map((val, idx) => (
              <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                {val}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default SummaryTab;
