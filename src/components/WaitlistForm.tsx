import styles from "@/styles/WaitlistForm.module.css";
import Image from "next/image";

export default function WaitlistForm() {
  return (
    <section className={styles.WaitlistSection} id="WaitlistSection">
      <div className={styles.badge}><Image src="/assets/icons/mail.svg" alt="how it works" width={20} height={20} />Join Waitlist</div>
      <h2 className="text-2xl font-bold mb-4">Be the first to experience smarter feedback.</h2>
      <p className="mb-6 text-gray-600">Join our early access list and get exclusive updates, early features, and launch perks.</p>
      <div className={styles.WaitlistInput}>
        <input placeholder="Enter your Email Address" />
        <button>Join Waitlist</button>
      </div>
      <span className="text-xs mt-2 text-gray-500">No spam, ever.</span>
    </section>
  )
}