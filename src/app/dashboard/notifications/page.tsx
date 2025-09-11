"use client";
import { useState } from "react";
import { X } from "lucide-react";

type Notification = {
  type: "Form response" | "System Update" | "Performance & Alerts";
  title: string;
  description: string;
  timestamp: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      type: "Form response",
      title: 'New response: "You have 5 new submissions for Customer Satisfaction Survey"',
      description: "Last submitted by Sarah M., 2 mins ago",
      timestamp: "24 July 2025 at 9:30am",
    },
    {
      type: "System Update",
      title: "Story mode form : Scenario ‘Store Assistant Demo’ has been published",
      description: "Published by Admin • 2 mins ago",
      timestamp: "24 July 2025 at 9:30am",
    },
    {
      type: "Performance & Alerts",
      title: "Form alert : Product Knowledge Quiz has reached 500 total completions",
      description: "Last milestone hit 2 weeks ago",
      timestamp: "24 July 2025 at 9:30am",
    },
  ]);

  // Dismiss notification by index
  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Notifications (0)</h1>
        </div>
        <h1 className="text-sm text-gray-500">You have no new notifications.</h1>
        {/* Empty placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40">
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Notifications ({notifications.length})
        </h1>
      </div>

      {/* Notification cards */}
      <div className="flex flex-col gap-4">
        {notifications.map((note, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-6 flex flex-col gap-2 relative"
          >
            {/* Dismiss button */}
            <button
              className="absolute top-3 left-3 text-gray-400 hover:text-gray-600"
              onClick={() => dismissNotification(idx)}
            >
              <X size={16} />
            </button>

            <div className="flex justify-between p-4">
              <div>
                {/* Badge */}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    note.type === "Form response"
                      ? "bg-green-100 text-green-800"
                      : note.type === "System Update"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {note.type}
                </span>
                <h2 className="mt-2 text-base font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-600">{note.description}</p>
              </div>
              <p className="text-xs text-gray-400">{note.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
