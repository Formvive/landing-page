import styles from "@/styles/HowItWorks.module.css";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function HowItWorks() {
  const steps = [
    {
      img: "/assets/images/1.svg",
      title: "Build a form in minutes.",
      description:
        "Use Formvive’s simple builder to create questions, choose insights you want, and customize your branding — no clutter, no code.",
      icon: "/assets/icons/share.svg",
    },
    {
      img: "/assets/images/2.svg",
      title: "Share the link.",
      description:
        "Every form has a unique Formvive link. Send it anywhere. Respondents fill out your form manually or let our permission-based AI auto-fill it for them.",
      icon: "/assets/icons/list.svg",
    },
    {
      img: "/assets/images/3.svg",
      title: "Get feedback on your dashboard.",
      description:
        "See real answers alongside AI-backed predictions, all clearly tagged and easy to filter. Spot trends, test ideas, and make decisions faster.",
      icon: "/assets/icons/dash.svg",
    },
  ];

  return (
    <section className={styles.how} id="how">
      <div className={styles.badge}>
        <Image src="/assets/icons/hiw.svg" alt="how it works" width={20} height={20} />
        How it works
      </div>
      <h2 className={inter.className}>How Formvive Works</h2>
      <p className={styles.subtitle}>
        <span className={inter.className}>
          Three simple steps to effortless feedback and smarter decisions.
        </span>
      </p>

      <div className={styles.steps}>
        {steps.map((step, i) => (
          <div key={i} className={styles.card}>
            <Image src={step.img} alt={step.title} width={500} height={500}/>
            <h3>
              <span><Image src={step.icon} className={styles.icon} alt="how it works" width={20} height={20} /></span> {step.title}
            </h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
