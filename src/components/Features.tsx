import styles from "@/styles/Features.module.css";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function Features() {
  const features = [
    {
      icon: "/assets/icons/qw.svg",
      title: "Interactive Form Modes",
      description: "Gives you the choice to respond through a chat, a guided story, a quick game, or a clean classic form. Engagement goes up when forms feel good.",
    },
    {
      icon: "/assets/icons/qe.svg",
      title: "Smart Sharing Options",
      description: "Branded links, website embeds, overlays, or QR codes to reach people where they already are to boost response rates.",
    },
    {
      icon: "/assets/icons/qr.svg",
      title: "Privacy-first",
      description:
        "No shady tracking. Always opt-in.\nGDPR & CCPA ready, so your users know their data stays safe.",
    },
    {
      icon: "/assets/icons/qt.svg",
      title: "Built-In Subscriber Loop",
      description:
        "Add a simple opt-in at the end so people can hear from you again, share more insights, and stick around.",
    },
    {
      icon: "/assets/icons/qy.svg",
      title: "Build & share forms in minutes",
      description:
        "A modern, simple form builder — no clutter, no fuss. Just build, share the link, and get insights instantly.",
    },
    {
      icon: "/assets/icons/qa.svg",
      title: "Make better decisions, faster",
      description:
        "Formvive’s clear dashboards and smart data help you act on insights instantly — no more guesswork or wasted time.",
    },
  ];

  return (
    <section className={styles.features} id="features">
      <div className={styles.badge}><Image src="/assets/icons/features.svg" alt="how it works" width={20} height={20} /> Unique Features</div>
      <h2 className={inter.className}>Built for teams validating products, ideas & markets.</h2>
      <p className={styles.subtitle}><span className={inter.className}>
        The hyper-intelligent platform to build forms, share them, and collect real + predicted responses instantly.
        </span>
      </p>

      <div className={styles.cards}>
        {features.map((feature, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>
              <Image src={feature.icon} alt="how it works" width={28} height={28} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
