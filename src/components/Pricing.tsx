import styles from "@/styles/Pricing.module.css";
import Image from "next/image";

export default function Pricing() {
  const tiers = [
    {
      title: "Starter — Free",
      price: "$16.00",
      label: "Save up to 15%",
      description: "No commitment. Just build and share your first forms.",
      features: [
        "Build unlimited forms",
        "Manual responses only",
        "Basic analytics dashboard",
        "Share via unique link",
        "Community support",
      ],
      button: "Start Free",
    },
    {
      title: "Essential",
      price: "$24.00",
      label: "Save up to 15%",
      description: "Unlock the power of data analytics and gain actionable insights.",
      features: [
        "Everything in Starter",
        "AI Auto-Fill enabled",
        "Permission-based data parsing",
        "See manual + predicted answers",
        "Export responses (CSV)",
        "Email support",
      ],
      button: "Upgrade to Essential",
      highlight: true,
    },
    {
      title: "Team",
      price: "$79.00",
      label: "Save up to 20%",
      description: "Advanced AI features and team collaboration for growing companies.",
      features: [
        "Everything in Essential",
        "Multi-user team workspace",
        "Roles & permissions",
        "Shared dashboards",
        "Priority support",
      ],
      button: "Get Team Access",
    },
    {
      title: "Enterprise",
      price: "$ Custom",
      label: "Custom Pricing",
      description: "Tailored for large teams with advanced security needs.",
      features: [
        "Everything in Team",
        "Dedicated account manager",
        "Custom branding",
        "Advanced privacy controls",
        "API integrations",
        "SLA & onboarding",
      ],
      button: "Contact Sales",
    },
  ];

  return (
    <section className={styles.pricing}>
      <span>
        <Image src="/assets/icons/pricing.svg" alt="Facebook" width={20} height={20} />
        Pricing
      </span>

      <div className={styles.tiers}>
        {tiers.map((tier, i) => (
          <div key={i} className={`${styles.card} ${tier.highlight ? styles.highlight : ""}`}>
            <h3>{tier.title}</h3>
            <p className={styles.description}>{tier.description}</p>
            <span className={styles.label}>{tier.label}</span>
            <p className={styles.price}>{tier.price} <span>/ Month</span></p>
            <button className={tier.highlight ? styles.primaryBtn : styles.secondaryBtn}>
              {tier.button}
            </button>
            <ul>
              {tier.features.map((f, j) => (
                <li key={j}>✔ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
