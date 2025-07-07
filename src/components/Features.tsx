import styles from "@/styles/Features.module.css";
import Image from "next/image";

export default function Features() {
  const features = [
    {
      icon: "/assets/icons/qw.svg",
      title: "Predict real user behavior before you launch",
      description:
        "Run simulations to see how real people might respond, test product-market fit, or validate demand early.",
    },
    {
      icon: "/assets/icons/qe.svg",
      title: "Increase response rates automatically",
      description:
        "More people, more data — your audience can respond manually or let AI do it for them, so you never lose insights to form fatigue.",
    },
    {
      icon: "/assets/icons/qr.svg",
      title: "Privacy-first, permission-based AI",
      description:
        "Formvive only reads data users allow — like location or browser context — to predict answers responsibly.",
    },
    {
      icon: "/assets/icons/qt.svg",
      title: "Combine real & predicted insights.",
      description:
        "Every response is clearly tagged, so you know exactly what was user-entered and what was AI-predicted.",
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
    <section className={styles.features}>
      <div className={styles.badge}><Image src="/assets/icons/features.svg" alt="how it works" width={20} height={20} /> Unique Features</div>
      <h2>Built for teams validating products, ideas & markets.</h2>
      <p className={styles.subtitle}>
        The AI-powered platform to build forms, share them, and collect real + predicted responses instantly.
      </p>

      <div className={styles.cards}>
        {features.map((feature, i) => (
          <div key={i} className={styles.card}>
            <Image src={feature.icon} alt="how it works" width={40} height={40} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
