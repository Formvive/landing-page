import styles from "@/styles/Footer.module.css";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className={styles.footer}>
        <div className={styles.footerContainer}>
            <div className={styles.container}>
                <div className={styles.left}>
                <h3>FormVive</h3>
                <p>
                    Formvive makes feedback effortless and insights actionable.  short, clear, covers your why.
                </p>
                <a href="mailto:hello@formvive.com" className={styles.email}>
                <Image src="/assets/icons/mail.svg" alt="Facebook" width={20} height={20} />
                    hello@formvive.com
                </a>
                </div>

                <div className={styles.center}>
                <div className={styles.column}>
                    <h4>Home</h4>
                    <ul>
                    <li>Overview</li>
                    <li>Benefits</li>
                    <li>How it works</li>
                    <li>Pricing</li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>Company</h4>
                    <ul>
                    <li>About us</li>
                    <li>Our Team</li>
                    <li>FAQs</li>
                    <li>Testimonials</li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>All pages</h4>
                    <ul>
                    <li>Home</li>
                    <li>Waitlist</li>
                    <li>Contact</li>
                    </ul>
                </div>
                </div>

                <div className={styles.right}>
                <h4>Social Profiles</h4>
                    <div className={styles.socialIcons}>
                        <a href="#">
                            <Image src="/assets/icons/Facebook.svg" alt="Facebook" width={20} height={20} />
                        </a>
                        <a href="#">
                            <Image src="/assets/icons/X.svg" alt="Twitter" width={20} height={20} />
                        </a>
                        <a href="#">
                            <Image src="/assets/icons/insta.svg" alt="Instagram" width={20} height={20} />
                        </a>
                        <a href="#">
                            <Image src="/assets/icons/LinkedIn.svg" alt="LinkedIn" width={20} height={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>Copyright ©2023 FormVive.com</p>
                <p>Privacy Policy</p>
            </div>
        </div>
    </footer>
  );
}
