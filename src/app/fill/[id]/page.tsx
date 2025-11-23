"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/utils/authHelper";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load token
  useEffect(() => {
    const storedToken = getAuthToken();
    setToken(storedToken);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token || !formId) return;

    const fetchData = async () => {
      try {
        const [resForm, resQuestions] = await Promise.all([
          fetch(
            `https://form-vive-server.onrender.com/api/v1/user/get-singular-form/${encodeURIComponent(
              formId
            )}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `https://form-vive-server.onrender.com/api/v1/user/get-questions/${encodeURIComponent(
              formId
            )}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        if (!resForm.ok || !resQuestions.ok) throw new Error("Failed to fetch form data");

        const formData = await resForm.json();
        const questionsData = await resQuestions.json();

        setFormDetails(formData.data);
        setQuestions(questionsData.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load this form. It may not exist or requires permission.");
      }
    };

    fetchData();
  }, [token, formId]);

  const handleChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
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
            location: "Lagos", // You might want to make this dynamic later
            age: "TwentyNine_TO_ThirtyFive", // This too
          }),
        }
      );
      
      const responseData = await resp.json();
      
      if(!resp.ok) throw new Error("Failed to initiate response");

      const responseId = responseData.data.id;

      // Step 2: Submit answers
      const ansResp = await fetch(
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

      if(!ansResp.ok) throw new Error("Failed to submit answers");

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading State ---
  if (!formDetails && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-[#fdf2ff]">
        <Loader2 className="animate-spin h-8 w-8 text-black mb-4" />
        <p className="text-gray-500 text-sm font-medium">Loading form...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-screen bg-[#fdf2ff] p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
          <div className="bg-red-50 text-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
             ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // --- Success State ---
  if (submitted) {
    return (
      <div className="min-h-screen min-w-screen bg-[#fdf2ff] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="h-2 bg-green-500 w-full" />
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500 mb-8">
              Your response has been recorded successfully.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-gray-400 hover:text-black underline"
            >
              Submit another response
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Form UI ---
  return (
    <div className="min-h-screen min-w-screen bg-[#fdf2ff] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Form Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-3 bg-black w-full" /> {/* Accent Bar */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {formDetails?.formName}
            </h1>
            <p className="text-gray-500">
              Please fill out the questions below. Fields marked with <span className="text-red-500">*</span> are required.
            </p>
          </div>
        </div>

        {/* Questions Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <label className="block text-lg font-medium text-gray-800 mb-4">
                {q.text} {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.value;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 group
                          ${isSelected 
                            ? "border-black bg-gray-50 ring-1 ring-black" 
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors
                          ${isSelected ? "border-black" : "border-gray-300 group-hover:border-gray-400"}
                        `}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                        </div>
                        
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => handleChange(q.id, opt.value)}
                          required={q.required}
                          className="sr-only" // Hide default radio
                        />
                        <span className={`text-sm ${isSelected ? "text-black font-medium" : "text-gray-600"}`}>
                          {opt.option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === "OPEN_ENDED" && (
                <div className="relative">
                  <textarea
                    className="w-full min-h-[120px] p-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all resize-y text-gray-800"
                    placeholder="Type your answer here..."
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    required={q.required}
                  />
                  {/* Optional: Add a subtle corner decoration or line */}
                  <div className="absolute bottom-3 right-3 pointer-events-none">
                     <span className="text-[10px] text-gray-400">⏎ Shift + Enter for new line</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Submit Button Area */}
          <div className="flex justify-between items-center pt-4">
             {/* Optional: Add location/privacy hint */}
             <div className="flex items-center text-xs text-gray-400 gap-1">
                <MapPin size={12} />
                <span>Location captured automatically</span>
             </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
              {isSubmitting ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </form>

        {/* Branding Footer */}
        <div className="text-center pb-8">
           <p className="text-xs text-gray-400">Powered by <span className="font-bold text-gray-600">FormVive</span></p>
        </div>
      </div>
    </div>
  );
}