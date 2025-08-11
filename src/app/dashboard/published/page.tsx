"use client";
import { LiveForm } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import { Plus } from "lucide-react";

export default function MyPublishedPage() {
    const liveForms: LiveForm[] = [
        {
          title: "TMC Jogging Survey",
          publishedAgo: "4 days ago",
          mode: "Chat Mode",
          responses: 128,
          status: "Live",
          previewUrl: "/assets/ph.png",
        },
        {
          title: "TMC Jogging Survey",
          publishedAgo: "4 days ago",
          mode: "Chat Mode",
          responses: 128,
          status: "Live",
          previewUrl: "/assets/ph.png",
        },
        {
          title: "TMC Jogging Survey",
          publishedAgo: "4 days ago",
          mode: "Chat Mode",
          responses: 128,
          status: "Live",
          previewUrl: "/assets/ph.png",
        },
        {
          title: "TMC Jogging Survey",
          publishedAgo: "4 days ago",
          mode: "Chat Mode",
          responses: 128,
          status: "Live",
          previewUrl: "/assets/ph.png",
        },
      ];

      if (liveForms.length === 0) {
        return (
            <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Live Forms (0)</h1>
                <Link href={"/dashboard/create-form"}>
                <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md">
                    <Plus size={16} /> Create New Form
                </button>
                </Link>
            </div>
            <h1 className="text-sm text-gray-500">Forms you publish will appear here. Start building to go live.</h1>
            {/* Empty placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40">
                <p className="text-gray-500">No published forms yet.</p>
            </div>
            </div>
        );
      }

    return (
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Live Forms ({liveForms.length})
            </h1>
            <Link href="/dashboard/create-form">
              <button className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md">
                <Plus size={16} /> Create new Form
              </button>
            </Link>
          </div>
    
          {/* Subheading */}
          <p className="text-center text-gray-500 text-sm">
            Track your live forms, manage responses, or make updates anytime.
          </p>
    
          {/* Forms grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {liveForms.map((form, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 flex flex-row justify-between"
              >
                <div className="w-full">
                  <h2 className="font-medium">{form.title}</h2>
                  <p className="text-sm text-gray-500">
                    Published {form.publishedAgo}
                  </p>
                  <p className="text-sm mt-1">
                    Mode: <span className="font-semibold">{form.mode}</span>
                  </p>
                  <p className="text-sm">
                    Responses: <span className="font-semibold">{form.responses}</span>
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Status: {form.status}
                  </p>
                </div>
                <div className="mt-4 border rounded overflow-hidden w-full">
                  <Image
                    width={400}
                    height={200}
                    src={form.previewUrl}
                    alt="Form preview"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}