"use client";

import { useState } from 'react';
// import Link from 'next/link';
import styles from "@/styles/CTA.module.css";
import WaitlistModal from "../components/WaitlistModal";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function CTA() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.cta}>
      <h2>Ready to see smarter feedback in action?</h2>
      <p>Start free and discover how effortless data can be.</p>
      {/* <Link href={"/signup"}> */}
        <button onClick={() => setShowModal(true)}>Start Free</button>
      {/* </Link> */}
      <span className={inter.className}>No credit card needed.</span>
      <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
