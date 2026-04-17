import { useState } from "react";
import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";    
import img911 from "../../assets/icons/911@2x.png";
import taycan from "../../assets/icons/electric car2.jpg"
import cayenee from "../../assets/icons/filters_format(avif) (4).png"
import suv from "../../assets/icons/suv car.jpg"
import sport from "../../assets/icons/sport car.webp"
import electric from "../../assets/icons/electric car.jpg"
import sedan from "../../assets/icons/sedan car.jpg"
import cayman from "../../assets/icons/718 caymans.png"
const categories = [
  { label: "SUV", img: suv},
  { label: "Sports", img: sport },
  { label: "Electric", img: electric },
  { label: "Sedan", img: sedan },
];

const models = [
  { name: "911", img: img911  },
  { name: "718", img: cayman },
  { name: "Cayenne", img: cayenee },
];

export default function Home() {
  const [activeModel, setActiveModel] = useState(0);
  const prev = () => setActiveModel((i) => (i - 1 + models.length) % models.length);
  const next = () => setActiveModel((i) => (i + 1) % models.length);

  return (
    <div className={styles.home}>
        
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Pure Driving<br />Emotion</h1>
          <p>
            Built for performance. Driven by passion. The Porsche 911 delivers pure driving excitement.
          </p>
          <button className={styles.btnDark}>Shop now</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.categories}>
        <h2>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <div className={styles.categoryCard} key={cat.label}>
              <img src={cat.img} alt={cat.label} />
              <div className={styles.overlay}></div>
              <div className={styles.categoryInfo}>
                <span>{cat.label}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODELS */}
      <section className={styles.models}>
        <h2>MODELS</h2>
        <div className={styles.carousel}>
          <button onClick={prev} className={`${styles.arrow} ${styles.left}`}>‹</button>
          <div className={styles.modelContent}>
            <p className={styles.modelName}>{models[activeModel].name}</p>
            <img src={models[activeModel].img} alt="" className={styles.modelImg} />
            <div className={styles.buttons}>
              <button className={styles.btnDark}>Explore</button>
              <button className={styles.btnOutline}>Discover</button>
            </div>
          </div>
          <button onClick={next} className={`${styles.arrow} ${styles.right}`}>›</button>
        </div>
      </section>
    </div>
  );
}