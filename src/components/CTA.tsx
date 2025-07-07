import styles from "@/styles/CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h2>Ready to see smarter feedback in action?</h2>
      <p>Start free and discover how effortless data can be.</p>
      <button>Start Free</button>
      <span>No credit card needed.</span>
    </section>
  );
}
