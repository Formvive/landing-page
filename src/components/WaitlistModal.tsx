import { useEffect } from "react";
import styles from "@/styles/WaitlistModal.module.css";
import Image from "next/image";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close Modal">
          ×
        </button>
        <h1>You’re early and that’s a good thing</h1>
        <p>
          Formvive is opening soon. Join the waitlist for exclusive early access and launch perks.
        </p>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Enter your Email Address"
            className={styles.input}
          />
          <button className={styles.submitBtn}>Join Waitlist</button>
        </div>

        <div className={styles.joined}>
            <div className={styles.joinedImages}>
                <Image
                    src="/assets/avatars/Ellipse 3.png"
                    alt="People joined"
                    width={20}
                    height={20}
                />
                <Image
                    src="/assets/avatars/Ellipse 4.png"
                    alt="People joined"
                    width={20}
                    height={20}
                />
                <Image
                    src="/assets/avatars/Ellipse 5.png"
                    alt="People joined"
                    width={20}
                    height={20}
                />
            </div>
            <span>1K people have joined the list</span>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;