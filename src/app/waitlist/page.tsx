'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/styles/WaitlistPage.module.css";

export default function WaitlistPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, router]);

  const handleEmailSubmit = () => {
    if (!email) return;
    setStep(2);
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

      setIsSuccess(true);
    } catch (err) {
      alert( "Error submitting. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        {isSuccess ? (
          <div className={styles.successWrapper}>
            <div className={styles.checkmarkWrapper}>
              <div className={styles.checkmark}></div>
            </div>
            <h2>All done, thank you!</h2>
          </div>
        ) : step === 1 ? (
          <>
            <h1>You’re early and that’s a good thing</h1>
            <p>Formvive is opening soon. Join the waitlist for exclusive early access and launch perks.</p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter your Email Address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button
                className={styles.submitBtn}
                onClick={handleEmailSubmit}
                disabled={isLoading || !email}
              >
                {isLoading ? <span className={styles.spinner}></span> : "Join Waitlist"}
              </button>
            </div>
            <div className={styles.joined}>
              <div className={styles.joinedImages}>
                <Image src="/assets/avatars/Ellipse 3.png" alt="avatar" width={20} height={20} />
                <Image src="/assets/avatars/Ellipse 4.png" alt="avatar" width={20} height={20} />
                <Image src="/assets/avatars/Ellipse 5.png" alt="avatar" width={20} height={20} />
              </div>
              <span>1K people have joined the list</span>
            </div>
          </>
        ) : (
          <>
            <h1>Help Us Build for You</h1>
            <p>Tell us a bit more so we can make Formvive work for you.</p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                disabled
                className={styles.input}
              />
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                disabled={isLoading}
              />
              <label>How do you intend to use Formvive?</label>
              <input
                type="text"
                placeholder="Product validation, UX testing, Research etc..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.input}
                disabled={isLoading}
              />
              <button
                className={styles.submitBtn}
                onClick={handleFinalSubmit}
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.spinner}></span> : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
