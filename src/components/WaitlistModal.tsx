import { useEffect, useState } from "react";
import styles from "@/styles/WaitlistModal.module.css";
import Image from "next/image";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (!isOpen) {
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!email) return;
  
    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) throw new Error("Failed to submit");
  
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close Modal">
          <Image src="/assets/icons/close.svg" alt="close" width={18} height={18} />
        </button>

        {isSuccess ? (
          <div className={styles.successWrapper}>
            <div className={styles.checkmarkWrapper}>
              <div className={styles.checkmark}></div>
            </div>
            <h2>All done, thank you!</h2>
          </div>
        ) : (
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
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner}></span>
                ) : (
                  "Join Waitlist"
                )}
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
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
