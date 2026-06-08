import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./PrivacyPolicy.module.css";

const sections = [
  {
    title: "Information We Collect",
    paragraphs: [
      "We may collect information you choose to provide when you create an account, save a vehicle, submit a form, or contact the service. This can include your name, email address, password, profile details, and any message you send through the app.",
      "We may also collect information automatically when you browse the site, such as device type, browser information, pages visited, approximate location derived from your connection, and usage data that helps us understand how the experience is performing.",
    ],
    bullets: [
      "Account details and profile settings",
      "Saved vehicles, favorites, and form submissions",
      "Device, browser, and session information",
    ],
  },
  {
    title: "How We Use Information",
    paragraphs: [
      "We use information to provide the service, keep your account secure, support saved preferences, and respond to questions or requests. We may also use aggregate information to improve the app layout, product presentation, and overall user experience.",
      "When needed, information can be used to prevent misuse, enforce our terms, or maintain the stability and security of the platform.",
    ],
    bullets: [
      "Operate accounts and form features",
      "Personalize saved views and preferences",
      "Improve site performance and content",
    ],
  },
  {
    title: "Cookies and Analytics",
    paragraphs: [
      "The site may use cookies, local storage, or similar technologies to remember session state, keep you signed in, and measure how features are used. These tools help the app work smoothly and can reduce the need to re-enter settings on repeat visits.",
      "Analytics tools may collect generalized usage patterns so we can understand what content is helpful and where the experience can be improved.",
    ],
  },
  {
    title: "Sharing of Information",
    paragraphs: [
      "We may share information with service providers that help operate the site, such as hosting, analytics, communications, or security partners. We may also disclose information if required to comply with law, respond to a legal process, or protect the rights, safety, and integrity of the service.",
      "If the business is reorganized, merged, or sold, information may be transferred as part of that transaction subject to applicable safeguards.",
    ],
  },
  {
    title: "Data Retention and Security",
    paragraphs: [
      "We retain information for as long as needed to provide the service, support your account, comply with legal obligations, or resolve disputes. We use reasonable safeguards to help protect information, but no online service can guarantee complete security.",
    ],
  },
  {
    title: "Your Choices",
    paragraphs: [
      "You can update many account details through the app, and you can clear cookies or adjust browser settings if you prefer not to store them. You may also stop using the service at any time and request account-related help through the support options available in the app.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this policy from time to time to reflect product changes, operational needs, or legal requirements. When we do, the updated version will be posted on this page with a revised date.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <main className={styles.content}>
          <div className={styles.container}>
            <section className={styles.hero}>
              <div className={styles.heroBody}>
                <p className={styles.eyebrow}>Legal</p>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.intro}>
                  This policy explains how the site collects, uses, and protects information when you browse vehicles, create an account, save favorites, or submit a request.
                </p>

                <div className={styles.metaRow}>
                  <span className={styles.metaPill}>Last updated: May 26, 2026</span>
                  <Link className={styles.metaLink} to="/terms-of-service">
                    Read the Terms of Service
                  </Link>
                  <Link className={styles.metaLink} to="/">
                    Back to home
                  </Link>
                </div>
              </div>

              <aside className={styles.summaryCard} aria-label="Privacy Policy summary">
                <h2 className={styles.summaryTitle}>Privacy at a glance</h2>
                <ul className={styles.summaryList}>
                  <li>We collect account and browsing data to run the service.</li>
                  <li>Cookies and analytics help improve performance and usability.</li>
                  <li>You can update account details and manage browser settings.</li>
                  <li>We keep information only as long as it is needed for the service.</li>
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
                <p>For service rules and usage expectations, review the Terms of Service.</p>
                <Link className={styles.footerLink} to="/terms-of-service">
                  Read the Terms of Service
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
