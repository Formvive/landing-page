// "use client";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import DraggableQuestionCard from "./DraggableQuestionCard";
// import { useState } from "react";

// interface Question {
//   id: string;
//   label: string;
//   type: "input" | "textarea" | "radio";
//   name: string;
//   value: string;
//   options?: string[];
// }

// export default function QuestionList() {
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       id: "q1",
//       label: "Name",
//       type: "input",
//       name: "name",
//       value: "",
//     },
//     {
//       id: "q2",
//       label: "Feedback",
//       type: "textarea",
//       name: "feedback",
//       value: "",
//     },
//   ]);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       setQuestions((items) => {
//         const oldIndex = items.findIndex((q) => q.id === active.id);
//         const newIndex = items.findIndex((q) => q.id === over.id);
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<any>, id: string) => {
//     const { name, value } = e.target;
//     setQuestions((qs) =>
//       qs.map((q) => (q.id === id ? { ...q, [name]: value } : q))
//     );
//   };

//   const handleDelete = (id: string) => {
//     setQuestions((qs) => qs.filter((q) => q.id !== id));
//   };

//   return (
//     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext
//         items={questions.map((q) => q.id)}
//         strategy={verticalListSortingStrategy}
//       >
//         <div className="space-y-4">
//           {questions.map((q, index) => (
//             <DraggableQuestionCard
//               key={q.id}
//               id={q.id}
//               index={index}
//               question={q}
//               onChange={handleChange}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// }
