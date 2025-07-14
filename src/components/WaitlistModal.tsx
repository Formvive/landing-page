// src/components/WaitlistModal.tsx

import { useEffect, useState } from "react";
import styles from "@/styles/WaitlistModal.module.css";
import Image from "next/image";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (!isOpen) {
      setStep(1);
      setEmail("");
      setName("");
      setReason("");
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

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
      alert("Error submitting. Please try again." + err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <Image src="/assets/icons/close.svg" alt="close" width={18} height={18} />
        </button>

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
            <p>
              Formvive is opening soon. Join the waitlist for exclusive early access and launch perks.
            </p>
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
                className={styles.input}
                value={email}
                disabled={isLoading}
              />
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              <label>How do you intend to use Formvive?</label>
              <input
                type="text"
                placeholder="Product validation, UX testing, Research etc..."
                className={styles.input}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
};

export default WaitlistModal;
