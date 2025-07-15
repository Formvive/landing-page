"use client";

import { useState } from "react";
import styles from "@/styles/WaitlistForm.module.css";
import style from "@/styles/WaitlistModal.module.css";
import Image from "next/image";

export default function WaitlistForm() {
  const [step, setStep] = useState<"email" | "details" | "success">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = () => {
    if (!email) return;
    setStep("details");
  };

  const handleFinalSubmit = async () => {
    if (!email || !name || !reason) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, reason }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStep("success");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.WaitlistSection} id="WaitlistSection">
      <div className={styles.badge}>
        <Image src="/assets/icons/mail.svg" alt="Join waitlist" width={20} height={20} />
        Join Waitlist
      </div>

      {step === "success" ? (
        <>
          <h2 className="text-2xl font-bold mb-4">All done, thank you!</h2>
          <p className="text-gray-600">You're officially on the waitlist 🎉</p>
        </>
      ) : step === "email" ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Be the first to experience smarter feedback.</h2>
          <p className="mb-6 text-gray-600">
            Join our early access list and get exclusive updates, early features, and launch perks.
          </p>
          <div className={styles.WaitlistInput}>
            <input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <button onClick={handleEmailSubmit} disabled={!email || isLoading}>
              Join Waitlist
            </button>
          </div>
          <span className="text-xs mt-2 text-gray-500">No spam, ever.</span>
        </>
      ) : (
        <>
          <h1 className={styles.modalh1}>Help Us Build for You</h1>
          <p className={styles.modalp}>Tell us a bit more so we can make Formvive work for you.</p>

          <div className={style.inputGroup}>
            <input
              type="email"
              className={style.input}
              value={email}
              disabled={isLoading}
            />
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Name"
              className={style.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <label>How do you intend to use Formvive?</label>
            <input
              type="text"
              placeholder="Product validation, UX testing, Research etc..."
              className={style.input}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
            <button
              className={style.submitBtn}
              onClick={handleFinalSubmit}
              disabled={isLoading}
            >
              {isLoading ? <span className={style.spinner}></span> : "Submit"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}