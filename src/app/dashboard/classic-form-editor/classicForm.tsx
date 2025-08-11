"use client";
import { useState } from "react";
import { QuestionField } from "@/types";
import RichTextEditor from "@/components/LexicalEditor";
import PreviewModal from "@/components/PreviewModal";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableQuestionCard from "@/components/SortableQuestionCard";


export default function ClassicFormEditor() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescriptionJSON, setFormDescriptionJSON] = useState("");

  const [formData, setFormData] = useState({
    challenges: "",
    dineOutFrequency: "",
    restaurantFactors: "",
    searchInfo: "",
    expectedFeatures: "",
    currentExperience: "",
    pastDifficulties: "",
    reservationPreference: "",
    paymentOptions: "",
    easeExpectations: "",
    encourageSwitch: "",
  });

  const [questions, setQuestions] = useState<QuestionField[]>([
    {
      id: "q1",
      label:
        "What are the biggest challenges you face when making restaurant reservations in Nigeria?",
      type: "textarea",
      name: "challenges",
      value: "",
    },
    {
      id: "q2",
      label: "How often do you dine out in restaurants?",
      type: "radio",
      name: "dineOutFrequency",
      options: ["Always", "Sometimes", "Never"],
      value: "",
    },
    {
      id: "q3",
      label: "What factors influence your choice of restaurant?",
      type: "input",
      name: "restaurantFactors",
      value: "",
    },
    {
      id: "q4",
      label:
        "What information do you typically look for when searching for a restaurant to make a reservation?",
      type: "textarea",
      name: "searchInfo",
      value: "",
    },
    {
      id: "q5",
      label:
        "What are the most important features or functionalities you expect from a table reservation website?",
      type: "textarea",
      name: "expectedFeatures",
      value: "",
    },
    {
      id: "q6",
      label:
        "How do you currently make restaurant reservations, and what is your experience with the process?",
      type: "textarea",
      name: "currentExperience",
      value: "",
    },
    {
      id: "q7",
      label:
        "Have you ever encountered any difficulties when making a reservation or during a dining experience, and how did you resolve them?",
      type: "textarea",
      name: "pastDifficulties",
      value: "",
    },
    {
      id: "q8",
      label:
        "Do you prefer to book your restaurant reservations online or over the phone?",
      type: "radio",
      name: "reservationPreference",
      options: ["Phone", "Online"],
      value: "",
    },
    {
      id: "q9",
      label:
        "What are your preferred payment options when booking a restaurant reservation online?",
      type: "input",
      name: "paymentOptions",
      value: "",
    },
    {
      id: "q10",
      label:
        "What are your expectations regarding the ease and speed of the reservation process?",
      type: "input",
      name: "easeExpectations",
      value: "",
    },
    {
      id: "q11",
      value: "",
      label:
        "What could a table reservation website offer that would encourage you to use it instead of traditional reservation methods?",
      type: "textarea",
      name: "encourageSwitch",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true); // No need for editor.update
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Untitled form</h2>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Save & Continue
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 pb-2">
        {["Classic mode", "Story mode", "Chat mode"].map((tab, idx) => (
          <button
            key={idx}
            className={`text-sm font-medium ${
              tab === "Classic mode"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title and Description */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="RESEARCH"
          className="w-full text-2xl font-semibold outline-none"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <RichTextEditor onChange={(value) => setFormDescriptionJSON(value)} />
      </div>

      {/* Sortable Questions */}
      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((field) => (
              <SortableQuestionCard
                key={field.id}
                id={field.id}
                field={field}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Preview Button */}
      <div className="text-center pt-6">
        <button
          onClick={handleOpenPreview}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Preview
        </button>
      </div>

      {/* ✅ PreviewModal Usage */}
        <PreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            title={formTitle}
            description={formDescriptionJSON}
            questions={questions}
            formData={formData}
        />
    </div>
  );
}
