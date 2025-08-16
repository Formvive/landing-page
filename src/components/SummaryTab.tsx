import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Answer = {
  questionId: string;
  value: string;
};

type Question = {
  id: string;
  text: string;
  type: "text" | "choice";
};

type Response = {
  answers: Answer[];
};

type FormDetails = {
  questions: Question[];
  responses: Response[];
};

function SummaryTab({ formDetails }: { formDetails: FormDetails }) {
  if (!formDetails?.responses?.length) {
    return <p className="text-gray-500">No responses yet.</p>;
  }

  return (
    <div className="space-y-6">
      {formDetails.questions.map((q) => {
        const answers = formDetails.responses
          .map((res) => res.answers.find((a) => a.questionId === q.id)?.value)
          .filter(Boolean) as string[];

        if (q.type === "choice") {
          const counts: Record<string, number> = {};
          answers.forEach((val) => {
            counts[val] = (counts[val] || 0) + 1;
          });

          const data = {
            labels: Object.keys(counts),
            datasets: [
              {
                data: Object.values(counts),
                backgroundColor: ["#EF4444", "#3B82F6", "#F59E0B", "#10B981"]
              }
            ]
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
