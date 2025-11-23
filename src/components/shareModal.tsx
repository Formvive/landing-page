"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Mail, Linkedin, Twitter, MessageCircle } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  formName: string;
}

export default function ShareModal({ isOpen, onClose, formId, formName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Construct the link on mount (client-side only to access window)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareLink(`${window.location.origin}/fill/${formId}`);
    }
  }, [formId]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // --- Social Share Links ---
  const encodedUrl = encodeURIComponent(shareLink);
  const encodedText = encodeURIComponent(`Check out this form: ${formName}`);

  const socialLinks = [
    {
      name: "Twitter/X",
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: "hover:bg-blue-50 hover:text-blue-500",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-50 hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={20} />,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: "hover:bg-green-50 hover:text-green-600",
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      url: `mailto:?subject=${encodeURIComponent(formName)}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: "hover:bg-gray-100 hover:text-gray-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Form</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Public Link</label>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={shareLink} 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5"
            />
            <button 
              onClick={handleCopy}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2 min-w-[100px] justify-center"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or share via</span>
          </div>
        </div>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-4 gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 transition-all ${social.color} group`}
            >
              <div className="text-gray-600 group-hover:scale-110 transition-transform">
                {social.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-500">{social.name}</span>
            </a>
          ))}
        </div>
        
      </div>
    </div>
  );
}