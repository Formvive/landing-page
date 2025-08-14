import { useState, useEffect } from "react";
import { QuestionField } from "@/types";

export default function QuestionsTab({ formId, token }: { formId: string; token: string | null }) {
    const [questions, setQuestions] = useState<QuestionField[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!token) return;
  
      const fetchQuestions = async () => {
        try {
          const res = await fetch(
            `https://form-vive-server.onrender.com/api/v1/user/get-questions/${encodeURIComponent(formId)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) throw new Error(`Error ${res.status}`);
          const data = await res.json();
  
          setQuestions(data.data || []);
        } catch (err) {
          console.error("Failed to fetch questions:", err);
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchQuestions();
    }, [formId, token]);
  
    if (loading) return <p className="p-6 text-gray-500">Loading questions...</p>;
    if (!questions.length) return <p className="p-6 text-gray-500">No questions found.</p>;
  
    const currentQuestion = questions[currentIndex];
  
    // TEMP placeholder until you wire up responses fetching
    const mockResponses = [
      { text: "No network", count: 1 },
      { text: ".", count: 1 },
    ];
  
    return (
      <div className="p-6">
        {/* Question Selector */}
        <div className="flex items-center justify-between mb-6">
          <select
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="border rounded-lg px-4 py-2 w-full max-w-xl text-gray-700"
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
  
        {/* Responses */}
        <div className="space-y-4">
          {mockResponses.map((resp, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-white">
              <p className="text-gray-800">{resp.text}</p>
              <p className="text-sm text-gray-500 mt-2">
                {resp.count} response{resp.count > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
  
        {/* Pagination Arrows */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className={`p-2 border rounded-full hover:bg-gray-100 ${
              currentIndex === 0 && "opacity-50 cursor-not-allowed"
            }`}
          >
            &#8592;
          </button>
          <button
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            className={`p-2 border rounded-full hover:bg-gray-100 ${
              currentIndex === questions.length - 1 &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            &#8594;
          </button>
        </div>
      </div>
    );
  }