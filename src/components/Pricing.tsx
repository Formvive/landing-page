import styles from "@/styles/Pricing.module.css";
import Image from "next/image";

export default function Pricing() {
  const plans = [
    {
      title: "Starter — Free",
      description: "Perfect for early founders, indie creators, and side projects.",
      label: "Save up to 100%",
      price: "$0.00",
      period: "/ forever",
      yearly: "No Extra fees",
      button: "Get Started Free",
      features: [
        { label: "Build Up to 5 forms forms", enabled: true },
        { label: "Classic mode only", enabled: true },
        { label: "100 responses/month", enabled: true },
        { label: "Basic dashboard", enabled: true },
        { label: "CSV export", enabled: true },
        { label: "Link or QR sharing", enabled: true },
        { label: "Email support", enabled: true },
        { label: "AI auto-fill mode", enabled: false },
        { label: "Subscriber loop", enabled: false },
        { label: "Team collaboration", enabled: false },
        { label: "Custom branding", enabled: false },
        { label: "Form logic or branching", enabled: false },
      ],
    },
    {
      title: "Essential",
      description: "Great for startups and product teams running experiments.",
      label: "Save up to 15% Yearly",
      price: "$18.00",
      period: "/ Month",
      yearly: "$180 / Year",
      button: "Upgrade to Essential",
      highlight: true,
      features: [
        { label: "Everything in Free", enabled: true },
        { label: "Unlimited forms", enabled: true },
        { label: "1,000 responses/month", enabled: true },
        { label: "All form modes: chat, story, game, classic", enabled: true },
        { label: "Custom end screens", enabled: true },
        { label: "Form logic & branching", enabled: true },
        { label: "AI simulation (100 credits/month)", enabled: true },
        { label: "Embed forms anywhere", enabled: true },
        { label: "Basic subscriber loop", enabled: true },
        { label: "Remove Formvive branding", enabled: true },
        { label: "Priority email support", enabled: true },
      ],
    },
    {
      title: "Pro",
      description: "For growing teams scaling feedback across launches.",
      label: "Save up to 20% Yearly",
      price: "$49.00",
      period: "/ Month",
      yearly: "$490 / Year",
      button: "Get Started Professionally",
      features: [
        { label: "Everything in Essential", enabled: true },
        { label: "10,000 responses/month", enabled: true },
        { label: "Unlimited AI credits", enabled: true },
        { label: "Custom domains", enabled: true },
        { label: "Team collaboration (5 teammates)", enabled: true },
        { label: "Advanced analytics & segmentation", enabled: true },
        { label: "Multi-language support", enabled: true },
        { label: "Webhooks & Slack integration", enabled: true },
        { label: "Early access to features", enabled: true },
        { label: "Live chat support", enabled: true },
      ],
    },
    {
      title: "Enterprise",
      description: "Custom solutions for big teams, agencies, or universities.",
      label: "Contact us for pricing",
      price: "$Custom",
      period: "/ Month",
      yearly: "$Custom / Year",
      button: "Get Started Professionally",
      features: [
        { label: "Everything in Pro", enabled: true },
        { label: "Unlimited responses", enabled: true },
        { label: "Role-based access & security compliance (SOC 2, custom)", enabled: true },
        { label: "Onboarding & training", enabled: true },
        { label: "Dedicated success manager", enabled: true },
        { label: "Custom AI models (sandboxed)", enabled: true },
        { label: "Enterprise integrations (Salesforce, HubSpot, Notion)", enabled: true },
        { label: "Quarterly strategy reviews", enabled: true },
      ],
    },
  ];

  return (
    <section className={styles.pricing}>
      <div className={styles.header}>
        <Image src="/assets/icons/pricing.svg" alt="Pricing Icon" width={20} height={20} />
        <h2>Pricing</h2>
      </div>
      <div className={styles.tiers}>
        {plans.map((plan, i) => (
          <div key={i} className={`${styles.card} ${plan.highlight ? styles.highlight : ""}`}>
            <h3>{plan.title}</h3>
            <p className={styles.description}>{plan.description}</p>
            <span className={styles.label}>{plan.label}</span>
            <p className={styles.price}>{plan.price} <span>{plan.period}</span></p>
            <p className={styles.yearly}>{plan.yearly}</p>
            <button className={plan.highlight ? styles.primaryBtn : styles.secondaryBtn}>
              {plan.button}
            </button>
            <ul>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={feature.enabled ? styles.enabled : styles.disabled}>
                  {feature.enabled ? "✔" : "✘"} {feature.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
