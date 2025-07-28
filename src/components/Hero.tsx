"use client";
import { useState } from "react";
import WaitlistModal from "../components/WaitlistModal";
import styles from "@/styles/Hero.module.css";
import Image from "next/image";
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.actions}>
          <Link href="#features"><button className={styles.cta}>Features</button></Link>
          <Link href="#how"><span>Product</span></Link>
          {/* <a href="#benefits"><span>Pricing</span></a> */}
        </div>
        <span>FORMVIVE</span>
        <div className={styles.actions}>
          <Link href={"/waitlist"}><span>Login</span></Link>
          <Link href={"/waitlist"}><button className={styles.cta}>Get Started</button></Link>
          {/* <Link href={"/login"}><span>Login</span></Link>
          <Link href={"/signup"}><button className={styles.cta}>Get Started</button></Link> */}
        </div>
      </div>
      <div className={styles.topBarMobile}>
        <span>FORMVIVE</span>
        <div className={styles.actions}>
          <Link href={"/waitlist"}><button className={styles.cta}>Get Started</button></Link>
          {/* <Link href={"/signup"}><button className={styles.cta}>Get Started</button></Link> */}
          <button onClick={() => setIsOpen(true)}aria-label="Open menu"><Image src="/assets/icons/burger.svg" alt="mobile menu button" width={30} height={20} /></button>
        </div>

        <div className={`${styles.offcanvas} ${isOpen ? styles.show : ''}`}>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>

          <ul className={styles.menuList}>
            <li><Link href="/" className={styles.active}>Home</Link></li>
            <li><Link href="/">Product</Link></li>
            {/* <li><Link href="/">Pricing</Link></li> */}
            <li><Link href="/waitlist">Login</Link></li>
            {/* <li><Link href="/login">Login</Link></li> */}
          </ul>
        </div>

        {/* Optional: overlay to dim background */}
        {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
      </div>
      <section className={styles.hero}>
        <a href="#WaitlistSection" ><div className={styles.badge}><Image src="/assets/icons/light.svg" alt="how it works" width={20} height={20} />Join the waitlist for updates<Image src="/assets/icons/arr.svg" alt="how it works" width={20} height={20} /></div></a>
        <h1 className={inter.className}>Forms are broken. We rebuilt them to deliver better</h1>
        <p className={inter.className}>
          Formvive helps modern teams run feedback loops that feel seamless for users and insightful for builders.
          No-code. Multi-format. Plug and go.
        </p>
        <button className={styles.getStarted} onClick={() => setShowModal(true)}>Click to get better feedback today</button>
        <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <div className={styles.videoPreview}>
          <Image src="/assets/images/hero.svg" alt="Dashboard preview" width={1500} height={1500}/>
          <div className={styles.videoWrapper}>
            <p className={inter.className}>Collecting feedback shouldn’t be hard.</p>
            <span className={styles.caption}>
              For people building real things, who need real feedback.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
