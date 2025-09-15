"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { getAuthToken } from "@/utils/authHelper";

type Question = {
  id: string;
  text: string;
  type: "MULTIPLE_CHOICE" | "OPEN_ENDED";
  required: boolean;
  options: { id: string; value: string; option: string }[];
};

type FormDetails = {
  formName: string;
};

export default function AnswerFormPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;

  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Load token
  useEffect(() => {
    const storedToken = getAuthToken();
    setToken(storedToken);
  }, []);

  // Fetch form details
  useEffect(() => {
    if (!token || !formId) return;
    const fetchFormDetails = async () => {
      try {
        const res = await fetch(
          `https://form-vive-server.onrender.com/api/v1/user/get-singular-form/${encodeURIComponent(
            formId
          )}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setFormDetails(data.data);
      } catch (err) {
        console.error("Failed to fetch form details:", err);
      }
    };
    fetchFormDetails();
  }, [token, formId]);

  // Fetch questions
  useEffect(() => {
    if (!token || !formId) return;
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `https://form-vive-server.onrender.com/api/v1/user/get-questions/${encodeURIComponent(
            formId
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setQuestions(data.data || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
  }, [formId, token]);

  const handleChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    // Step 1: Create response
    const resp = await fetch(
      "https://form-vive-server.onrender.com/api/v1/user/create-response",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          manuallyFilled: true,
          aiFilled: false,
          location: "Lagos",
          age: "TwentyNine_TO_ThirtyFive",
        }),
      }
    );
    const responseData = await resp.json();
    const responseId = responseData.data.id;

    // Step 2: Submit answers
    await fetch(
      "https://form-vive-server.onrender.com/api/v1/user/create-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId,
          answers: Object.entries(answers).map(([qId, value]) => ({
            questionId: qId,
            value,
          })),
        }),
      }
    );

    setSubmitted(true);
  };

  if (!formDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
  
          {/* Message */}
          <p className="text-gray-600 font-medium">Loading form details...</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Dialog open={true} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-xl p-6 max-w-3xl w-full shadow-xl space-y-6 max-h-[85vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold">
              {submitted
                ? "✅ Thank you for your submission!"
                : formDetails.formName}
            </DialogTitle>

            {!submitted && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6"
              >
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <label className="font-semibold block">
                      {q.text} {q.required && "*"}
                    </label>

                    {q.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <label
                            key={opt.id}
                            className="inline-flex items-center space-x-2 mr-4"
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt.value}
                              checked={answers[q.id] === opt.value}
                              onChange={() => handleChange(q.id, opt.value)}
                              required={q.required}
                            />
                            <span>{opt.option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "OPEN_ENDED" && (
                      <textarea
                        className="w-full border px-3 py-2 rounded bg-white focus:ring focus:ring-blue-200"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        required={q.required}
                      />
                    )}
                  </div>
                ))}

                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
