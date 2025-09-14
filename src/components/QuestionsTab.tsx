import { useState } from "react";
// import { QuestionField } from "@/types";

interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
}

interface ResponseWithAnswers {
  id: string;
  location: string;
  age: string;
  createdAt: string;
  manuallyFilled: boolean;
  aiFilled: boolean;
  answers: Answer[];
}

export default function QuestionsTab({
  questions,
  responses,
}: {
  questions: { id: string; text: string }[];
  responses: ResponseWithAnswers[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions.length) return <p className="p-6 text-gray-500">No questions found.</p>;

  const currentQuestion = questions[currentIndex];

  // Group responses by answer text for this question
  const responseCounts: Record<string, number> = {};
  responses.forEach((resp) => {
    const answer = resp.answers.find((a) => a.questionId === currentQuestion.id);
    if (answer) {
      const key = answer.value || "No answer";
      responseCounts[key] = (responseCounts[key] || 0) + 1;
    }
  });

  const questionResponses = Object.entries(responseCounts).map(([text, count]) => ({
    text,
    count,
  }));

  return (
    <div className="p-6">
      {/* Question Selector */}
      <div className="flex items-center justify-between mb-6">
        <select
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="border rounded-lg px-4 py-2 w-full max-w-xl text-gray-700 focus:ring-2 focus:ring-black"
        >
          {questions.map((q, idx) => (
            <option key={q.id} value={idx}>
              {q.text}
            </option>
          ))}
        </select>
        <span className="ml-4 text-gray-500 whitespace-nowrap">
          {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Heading */}
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {currentQuestion.text}
      </h2>

      {/* Responses or Empty State */}
      {questionResponses.length > 0 ? (
        <div className="space-y-4 transition-all duration-300">
          {questionResponses.map((resp, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-800">{resp.text}</p>
              <p className="text-sm text-gray-500 mt-2">
                {resp.count} response{resp.count > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-gray-50 text-gray-400 text-sm transition-all duration-300">
          <p>No responses yet</p>
        </div>
      )}

      {/* Pagination Arrows */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className={`p-2 border rounded-full hover:bg-gray-100 transition-all ${
            currentIndex === 0 && "opacity-50 cursor-not-allowed"
          }`}
        >
          &#8592;
        </button>
        <button
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className={`p-2 border rounded-full hover:bg-gray-100 transition-all ${
            currentIndex === questions.length - 1 && "opacity-50 cursor-not-allowed"
          }`}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
