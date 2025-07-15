"use client";
import { useState } from "react";
import WaitlistModal from "../components/WaitlistModal";
import styles from "@/styles/Hero.module.css";
import Image from "next/image";


export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.hero}>
      <div className={styles.topBar}>
        <div className={styles.actions}>
          <a href="#how"><button className={styles.cta}>Benefits</button></a>
          <a href="#features"><span>Product</span></a>
          {/* <a href="#benefits"><span>Pricing</span></a> */}
        </div>
        <span>FORMVIVE</span>
        <div className={styles.actions}>
          <button>Login</button>
          <button className={styles.cta}>Get Started</button>
        </div>
      </div>
      <a href="#WaitlistSection" ><div className={styles.badge}><Image src="/assets/icons/light.svg" alt="how it works" width={20} height={20} />Join the waitlist for updates<Image src="/assets/icons/arr.svg" alt="how it works" width={20} height={20} /></div></a>

      <h1>What if your feedback funnel didn’t suck?</h1>
      <p>
        Formvive helps modern teams run feedback loops that feel seamless for users and insightful for builders.
        No-code. Multi-format. Plug and go.
      </p>
      <button className={styles.getStarted} onClick={() => setShowModal(true)}>Click to get better feedback today</button>
      <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className={styles.videoPreview}>
        <Image src="/assets/images/hero.png" alt="Dashboard preview" width={1300} height={550}/>
        <div className={styles.videoWrapper}>
          <p>Collecting feedback shouldn’t be hard.</p>
          <span className={styles.caption}>
            For people building real things, who need real feedback.
          </span>
        </div>
      </div>
    </section>
  );
}
