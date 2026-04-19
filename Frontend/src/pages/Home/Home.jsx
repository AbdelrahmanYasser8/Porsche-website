import { useState } from "react";
import { Link } from "react-router-dom"; // Add this import
import styles from "./Home.module.css";
import pv from "../../assets/icons/Porsche 911 GT3 RS.mp4";
import img911 from "../../assets/icons/911@2x.png";
import cayenee from "../../assets/icons/filters_format(avif) (4).png";
import cayman from "../../assets/icons/718 caymans.png";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";    

import suv from "../../assets/icons/suv car.jpg";
import sport from "../../assets/icons/sport car.webp";
import electric from "../../assets/icons/electric car.jpg";
import sedan from "../../assets/icons/sedan car.jpg";

const categories = [
  { label: "SUV", img: suv, path: "/shop/SUV" },
  { label: "Sports", img: sport, path: "/shop/Sports" },
  { label: "Electric", img: electric, path: "/shop/Electric" },
  { label: "Sedan", img: sedan, path: "/shop/Sedan" },
];

const models = [
  {
    name: "911",
    img: img911,
    exploreLink: "/models/911",
    discoverLink: "/discover/911",
  },
  {
    name: "718",
    img: cayman,
    exploreLink: "/models/718",
    discoverLink: "/discover/718",
  },
  {
    name: "Cayenne",
    img: cayenee,
    exploreLink: "/models/cayenne",
    discoverLink: "/discover/cayenne",
  },
];

export default function Home() {
  const [activeModel, setActiveModel] = useState(0);

  const prev = () =>
    setActiveModel((i) => (i - 1 + models.length) % models.length);

  const next = () =>
    setActiveModel((i) => (i + 1) % models.length);

  return (
    <div className={styles.home}>
      <Navbar/>
      {/* HERO */}
      <section className={styles.hero}>
       <video
    className={styles.heroVideo}
    autoPlay
    muted
    loop
    playsInline
  >
    <source src={pv} type="video/mp4" />
  </video>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {"Pure Driving Emotion".split(" ").map((word, i) => (
              <span
                key={i}
                className={styles.word}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className={styles.heroSub}>
            Built for performance. Driven by passion.
          </p>
          <a href='/shop'>
            <button className={styles.btnDark}>Shop Now</button>
          </a>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.categories}>
        <h2>Shop by Category</h2>

        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link 
              key={cat.label} 
              to={cat.path} 
              className={styles.categoryCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img src={cat.img} alt={cat.label} />
              <div className={styles.overlay}></div>

              <div className={styles.categoryInfo}>
                <span>{cat.label}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MODELS */}
     
      <section className={styles.models}>
        <span className={styles.sideLabel}>MODELS</span>
        <div className={styles.carousel}>
          
          {/* LEFT GHOST */}
          <div className={styles.sideCarLeft}>
            <img src={models[(activeModel - 1 + models.length) % models.length].img} />
          </div>

          {/* CENTER */}
          
          <div className={styles.modelContent}>
         
            <h1 className={styles.bigTitle}>DARE TO LIVE MORE</h1>

            <img
              src={models[activeModel].img}
              className={styles.modelImg}
            />

            <div className={styles.modelTabs}>
              {models.map((model, index) => (
                <button
                  key={index}
                  onClick={() => setActiveModel(index)}
                  className={`${styles.modelTab} ${
                    index === activeModel ? styles.active : ""
                  }`}
                >
                  {model.name}
                </button>
              ))}
              </div>
              </div>
              <div className={styles.buttons}>
 
</div>
          

          {/* RIGHT GHOST */}
          <div className={styles.sideCarRight}>
            <img src={models[(activeModel + 1) % models.length].img} />
          </div>

          {/* ARROWS */}
          <button onClick={prev} className={`${styles.arrow} ${styles.left}`}>‹</button>
          <button onClick={next} className={`${styles.arrow} ${styles.right}`}>›</button>

        </div>
          <div className={styles.modelButtons}>
    {/* <a href={models[activeModel].exploreLink} className={styles.btnExplore}> */}
    <a href='/Shop' className={styles.btnExplore}>
      EXPLORE THE MODEL
    </a>
    {/* <a href={models[activeModel].discoverLink} className={styles.btnDiscover}> */}
    <a href='/shop' className={styles.btnDiscover}>
      DISCOVER MORE
    </a>
  </div>

      </section>
      <Footer/>
    </div>
  );
}