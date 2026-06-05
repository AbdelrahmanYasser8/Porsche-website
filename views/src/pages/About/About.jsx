import Navbar from "../../components/Navbar/Navbar";
import wallpaper from "../../assets/images/wallpaper-porsche.png";
import Footer from "../../components/Footer/Footer";
import styles from "./About.module.css";

const stats = [
  {
    icon: "fa-solid fa-award",
    value: "75+",
    label: "Years of Excellence",
  },
  {
    icon: "fa-solid fa-users",
    value: "1M+",
    label: "Happy Customers",
  },
  {
    icon: "fa-solid fa-car-side",
    value: "50,000+",
    label: "Vehicles Sold Annually",
  },
  {
    icon: "fa-solid fa-heart",
    value: "98%",
    label: "Customer Satisfaction",
  },
];

const values = [
  {
    icon: "fa-solid fa-gem",
    title: "Quality First",
    copy: "Every vehicle in our collection undergoes rigorous inspection to ensure it meets our exacting standards. We never compromise on quality.",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Customer Focused",
    copy: "Your satisfaction is our priority. We're committed to providing personalized service and support throughout your journey with us.",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Innovation Driven",
    copy: "We embrace the latest automotive technologies and innovations, from electric vehicles to advanced safety features.",
  },
];

const About = () => {
  return (
    <>
      <div className={styles.aboutPage}>
        <Navbar transparent={true} />

        <section className={styles.hero}>
          <img
            src={wallpaper}
            alt="Porsche driving at speed"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Porsche Heritage</span>
            <h1>About Us</h1>
            <p>
              Engineering excellence since 1948. Porsche represents precision,
              performance, and timeless design. Every model is built to deliver
              an unforgettable driving experience.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.storySection}`}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionKicker}>Our Story</span>
            <h2>Built From Performance</h2>
            <p className={styles.storyText}>
              Founded in 1948, Porsche was built on a passion for performance
              and precision engineering. From the early days of the Porsche 356
              to the iconic 911, the brand has always focused on creating
              sports cars that deliver pure driving emotion.
            </p>
            <p className={styles.storyText}>
              Motorsport success helped shape Porsche's innovation, pushing
              technology and design to new levels. Every generation of vehicles
              reflects this commitment to excellence, balance, and timeless
              style.
            </p>
            <p className={styles.storyText}>
              Today, Porsche continues to evolve with modern electric and hybrid
              technology, while staying true to its heritage - building cars
              that connect the driver to the road in the most authentic way.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.statsSection}`}>
          <div className={`${styles.sectionInner} ${styles.statsGrid}`}>
            {stats.map((stat) => (
              <div className={styles.statCard} key={stat.label}>
                <span className={styles.iconCircle} aria-hidden="true">
                  <i className={stat.icon}></i>
                </span>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.valuesSection}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Our Values</span>
              <h2>The Standards Behind Every Drive</h2>
            </div>

            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <article className={styles.valueCard} key={value.title}>
                  <span className={styles.valueIcon} aria-hidden="true">
                    <i className={value.icon}></i>
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
