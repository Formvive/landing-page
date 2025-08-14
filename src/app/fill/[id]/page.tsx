"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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

  // Get stored token
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  // Fetch form details
  useEffect(() => {
    if (!token || !formId) return;
    const fetchFormDetails = async () => {
      try {
        const res = await fetch(
          `https://form-vive-server.onrender.com/api/v1/user/get-singular-form/${encodeURIComponent(formId)}`,
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
      }
    };
    fetchQuestions();
  }, [formId, token]);

  const handleChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    // Step 1: Create the response
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

  if (!formDetails) return <p>Loading...</p>;
  if (submitted) return <p>✅ Thank you for your submission!</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{formDetails.formName}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {questions.map((q) => (
          <div key={q.id}>
            <label className="block font-medium mb-2">
              {q.text} {q.required && "*"}
            </label>

            {q.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-1">
                {q.options.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleChange(q.id, opt.value)}
                      required={q.required}
                    />
                    {opt.option}
                  </label>
                ))}
              </div>
            )}

            {q.type === "OPEN_ENDED" && (
              <textarea
                className="border p-2 rounded w-full"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                required={q.required}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
