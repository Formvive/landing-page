import Link from 'next/link';
import styles from "@/styles/CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h2>Ready to see smarter feedback in action?</h2>
      <p>Start free and discover how effortless data can be.</p>
      <Link href={"/signup"}><button>Start Free</button></Link>
      <span>No credit card needed.</span>
    </section>
  );
}
