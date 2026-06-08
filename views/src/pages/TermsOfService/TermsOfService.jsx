import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./TermsOfService.module.css";

const sections = [
  {
    title: "Acceptance of These Terms",
    paragraphs: [
      "By accessing or using the site, you agree to follow these Terms of Service and any policies referenced here. If you do not agree, you should stop using the service.",
    ],
  },
  {
    title: "Accounts and Responsibility",
    paragraphs: [
      "If you create an account, you are responsible for keeping your login details confidential and for activity that happens under your account. Please provide accurate information and keep it updated when it changes.",
      "You should notify the service if you believe your account has been used without permission or if you notice a security issue.",
    ],
    bullets: [
      "Keep your password private",
      "Use accurate account information",
      "Report suspicious activity promptly",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "You may use the site for personal, lawful, and non-disruptive purposes. You must not attempt to damage, interfere with, reverse engineer, scrape, or overload the service, and you must not use the site to send unlawful, misleading, or harmful content.",
    ],
    bullets: [
      "Do not interfere with site security or performance",
      "Do not scrape or copy content without permission",
      "Do not use the service for unlawful activity",
    ],
  },
  {
    title: "Vehicle Listings and Content",
    paragraphs: [
      "Vehicle images, descriptions, specifications, prices, availability, and related content are provided for informational purposes only and may change at any time. The site may contain promotional material or model information that is not guaranteed to be current, complete, or error-free.",
      "You should confirm details directly before making any purchase, reservation, or other decision based on the information shown in the app.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "The site, including its layout, text, images, logos, and software, is protected by intellectual property laws and may be used only as permitted by these Terms. You may not reproduce or distribute site content except where allowed by law or with permission.",
    ],
  },
  {
    title: "Third-Party Links",
    paragraphs: [
      "The site may link to third-party websites or services. Those third-party services are controlled by their own terms and policies, and we are not responsible for their content, availability, or practices.",
    ],
  },
  {
    title: "Disclaimer and Limitation of Liability",
    paragraphs: [
      "The service is provided on an as-is and as-available basis. To the maximum extent allowed by law, we do not guarantee that the site will always be uninterrupted, error-free, or free from harmful components.",
      "To the extent permitted by law, we are not responsible for indirect, incidental, special, or consequential damages that may arise from your use of the site or reliance on its content.",
    ],
  },
  {
    title: "Updates and Termination",
    paragraphs: [
      "We may update the service or revise these Terms from time to time. Continued use of the site after an update means you accept the revised Terms. We may also suspend or end access if we believe a user has violated these Terms or created risk to the service.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <main className={styles.content}>
          <div className={styles.container}>
            <section className={styles.hero}>
              <div className={styles.heroBody}>
                <p className={styles.eyebrow}>Legal</p>
                <h1 className={styles.title}>Terms of Service</h1>
                <p className={styles.intro}>
                  These Terms describe the rules for using the site, creating an account, and interacting with the content and features provided in the app.
                </p>

                <div className={styles.metaRow}>
                  <span className={styles.metaPill}>Last updated: May 26, 2026</span>
                  <Link className={styles.metaLink} to="/privacy-policy">
                    Read the Privacy Policy
                  </Link>
                  <Link className={styles.metaLink} to="/">
                    Back to home
                  </Link>
                </div>
              </div>

              <aside className={styles.summaryCard} aria-label="Terms of Service summary">
                <h2 className={styles.summaryTitle}>Terms at a glance</h2>
                <ul className={styles.summaryList}>
                  <li>Use the service lawfully and keep your account secure.</li>
                  <li>Listings and specifications may change without notice.</li>
                  <li>Do not scrape, interfere with, or misuse the platform.</li>
                  <li>Third-party sites are governed by their own terms.</li>
                </ul>
              </aside>
            </section>

            <section className={styles.document}>
              {sections.map((section) => (
                <section className={styles.section} key={section.title}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p className={styles.sectionText} key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className={styles.sectionList}>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className={styles.footerNote}>
                <p>For details on data handling and cookies, review the Privacy Policy.</p>
                <Link className={styles.footerLink} to="/privacy-policy">
                  Read the Privacy Policy
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
