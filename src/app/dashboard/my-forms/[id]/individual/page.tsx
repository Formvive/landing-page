// import { notFound } from "next/navigation";

// async function getResponse(formId: string, responseId: string) {
// //   const res = await fetch(
// //     `https://form-vive-server.onrender.com/api/v1/forms/${formId}/responses/${responseId}`,
// //     { cache: "no-store" }
// //   );
// //   if (!res.ok) return null;
// //   return res.json();
// // }

// // export default async function ResponseDetailPage({
// //   params,
// // }: {
// //   params: { formId: string; responseId: string };
// // }) {
// //   const response = await getResponse(params.formId, params.responseId);
// //   if (!response) return notFound();

//   return (
//     <div className="p-6 space-y-4 bg-white rounded-xl shadow">
//       <h1 className="text-lg font-semibold">Individual Response</h1>
//       <p className="text-sm text-gray-500">
//         Submitted on 
//         2024-06-15 10:30 AM
//         {/* {new Date(response.date).toLocaleString()} */}
//       </p>

//       <div className="space-y-4">
//         {Object.entries(response.answers).map(([qId, answer]) => (
//           <div key={qId} className="border-b pb-3">
//             <p className="font-medium">{qId}</p>
//             <p className="text-sm text-gray-700">{String(answer)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
export default function ResponseDetailPage() {
  // 🔹 Fake placeholder response data
  const placeholderResponse = {
    date: "2025-07-25T14:03:00Z",
    answers: {
      "What are the biggest challenges you face when making restaurant reservations in Nigeria?":
        "No network",
      "How often do you dine out in restaurants?": "Always",
      "What factors influence your choice of restaurant?": "Omo na money oooh",
      "What information do you typically look for when searching for a restaurant to make a reservation?":
        "The menu first things first. If e pass me I pass am",
      "What are the most important features or functionalities you expect from a table reservation website?":
        "Bargaining",
      "How do you currently make restaurant reservations, and what is your experience with the process?":
        "Any restaurant wey dey do reservation mean say e pass my budget",
      "Have you ever encountered any difficulties when making a reservation or during a dining experience, and how did you resolve them?":
        "They brought a bill that was way over what I had home and away. So I pulled out my cockroach and screamed...",
      "Do you prefer to book your restaurant reservations online or over the phone?":
        "Phone",
      "What are your preferred payment options when booking a restaurant reservation online?":
        "Washing of plate",
      "What are your expectations regarding the ease and speed of the reservation process?":
        "I’m a 2 minutes man",
      "What could a table reservation website offer that would encourage you to use it instead of traditional reservation methods?":
        "Feature to price the food",
    },
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded-xl shadow">
      <h1 className="text-lg font-semibold">Individual Response</h1>
      <p className="text-sm text-gray-500">
        Submitted on {new Date(placeholderResponse.date).toLocaleString()}
      </p>

      <div className="space-y-4">
        {Object.entries(placeholderResponse.answers).map(([question, answer]) => (
          <div key={question} className="border-b pb-3">
            <p className="font-medium">{question}</p>
            <p className="text-sm text-gray-700">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
