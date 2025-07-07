import styles from "@/styles/Testimonials.module.css";
import Image from "next/image";
// import {Row, Col} from "react-bootstrap"


export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <span>
        <Image src="/assets/icons/people.svg" alt="Facebook" width={20} height={20} />
        Our Customers
      </span>
      <h2>See what our customers are saying</h2>

      <div className={styles.cards}>
        {[
          { name: "Fay Nelson", text: "Prior to using Formvive, feedback took 3x longer and no more patterns.", handle: "@fay_nelson", avatar: "/assets/avatars/fay.png", src: "/assets/icons/twt.svg" },
          { name: "Sade Bello", text: "Our user research time was cut in half. Formvive is a no-brainer.", handle: "@sadebello", avatar: "/assets/avatars/sade.png", src: "/assets/icons/inst.svg" },
          { name: "Amaya Lovato", text: "First-party feedback — exactly what we needed.", handle: "@amaya_l", avatar: "/assets/avatars/amaya.png", src: "/assets/icons/face.svg" },
          { name: "Sade Bello", text: "Our user research time was cut in half. Formvive is a no-brainer.", handle: "@sadebello", avatar: "/assets/avatars/sade.png", src: "/assets/icons/inst.svg" },
          { name: "Amaya Lovato", text: "First-party feedback — exactly what we needed.", handle: "@amaya_l", avatar: "/assets/avatars/amaya.png", src: "/assets/icons/face.svg" },
          { name: "Fay Nelson", text: "Prior to using Formvive, feedback took 3x longer and no more patterns.", handle: "@fay_nelson", avatar: "/assets/avatars/fay.png", src: "/assets/icons/twt.svg" },
        ].map((t, i) => (
          <div key={i} className={styles.card}>
            <h4>Incredibly useful product</h4>
            <p>{t.text}</p>
            <div className={styles.footer}>
              <div className={styles.user}>
                <Image src={t.avatar} alt={t.name} width={40} height={40} />
                <div>
                  <strong>{t.name}</strong>
                  <p>{t.handle}</p>
                </div>
              </div>
              <a href={`https://twitter.com/${t.handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                <Image src={t.src} alt="Twitter" width={48} height={48} />
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonBlurWrapper}>
        <div className={styles.blur}></div>
        <button className={styles.followBtn}>Follow us on social media</button>
      </div>
    </section>
  );
}
