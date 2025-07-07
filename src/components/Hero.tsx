import styles from "@/styles/Hero.module.css";
import Image from "next/image";


export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.topBar}>
        <div className={styles.actions}>
          <button className={styles.cta}>Benefits</button>
          <span>Product</span>
          <span>Pricing</span>
        </div>
        <span>FORMVIVE</span>
        <div className={styles.actions}>
          <button>Login</button>
          <button className={styles.cta}>Get Started</button>
        </div>
      </div>
      <div className={styles.badge}><Image src="/assets/icons/light.svg" alt="how it works" width={20} height={20} />Join the waitlist for updates<Image src="/assets/icons/arr.svg" alt="how it works" width={20} height={20} /></div>

      <h1>How product teams get clear feedback faster</h1>
      <p>
        The AI-powered platform to build forms, share them, and collect real + predicted responses instantly.
      </p>
      <button className={styles.getStarted}>Get Better Feedback</button>
      <div className={styles.videoPreview}>
        <Image src="/assets/images/hero.png" alt="Dashboard preview" />
        <div className={styles.videoWrapper}>
          <p>Collecting feedback shouldn’t be hard.</p>
          <span className={styles.caption}>
            Manual forms waste time. Low response rates cost insights. Formvive fixes this with AI-powered auto-fill so you get more data with less effort.
          </span>
        </div>
      </div>
    </section>
  );
}
