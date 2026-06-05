import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import styles from "./Home.module.css";
import pv from "../../assets/videos/porsche-911-gt3-rs.mp4";
import cayenneCoupeImg from "../../assets/images/cayenne-coupe.png";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import suv from "../../assets/images/suv.avif";
import sport from "../../assets/images/sport.jpg";
import electric from "../../assets/images/electric.jpg";
import sedan from "../../assets/images/sedan.jpeg";
import taycanImg from "../../assets/images/Taycan_TurboS.avif";
import macanImg from "../../assets/images/Macan_Electric.avif";
import img911Carrera from "../../assets/images/911_Carrera.avif";
import imgGT3RS from "../../assets/images/GT3_RS.avif";
import imgCayenneSUV from "../../assets/images/cayenne-side.png";
import imgTaycanBase from "../../assets/images/Taycan.avif";
import imgMacanGTS from "../../assets/images/Macan_GTS.avif";

const categories = [
  { label: "SUV", img: suv, path: "/shop/SUV" },
  { label: "Sports", img: sport, path: "/shop/Sports" },
  { label: "Electric", img: electric, path: "/shop/Electric" },
  { label: "Sedan", img: sedan, path: "/shop/Sedan" },
];

const gallerySlides = [
  {
    title: "911",
    slogan: "You can't hide who you are",
    logoText: "911",
    submodels: [
      { name: "911 Carrera", img: img911Carrera, exploreLink: "/shop", brochureLink: "#" },
      { name: "911 GT3 RS", img: imgGT3RS, exploreLink: "/shop", brochureLink: "#" }
    ]
  },
  {
    title: "Cayenne",
    slogan: "Dare to live more",
    logoText: "Cayenne",
    submodels: [
      { name: "Cayenne Coupe", img: cayenneCoupeImg, exploreLink: "/shop", brochureLink: "#" },
      { name: "Cayenne SUV", img: imgCayenneSUV, exploreLink: "/shop", brochureLink: "#" }
    ]
  },
  {
    title: "Taycan",
    slogan: "Soul, electrified",
    logoText: "Taycan",
    submodels: [
      { name: "Taycan Turbo S", img: taycanImg, exploreLink: "/shop", brochureLink: "#" },
      { name: "Taycan", img: imgTaycanBase, exploreLink: "/shop", brochureLink: "#" }
    ]
  },
  {
    title: "Macan",
    slogan: "Keep your essence",
    logoText: "Macan",
    submodels: [
      { name: "Macan Electric", img: macanImg, exploreLink: "/shop", brochureLink: "#" },
      { name: "Macan GTS", img: imgMacanGTS, exploreLink: "/shop", brochureLink: "#" }
    ]
  }
];

const MotionSection = motion.section;
const MotionDiv = motion.div;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [subTabs, setSubTabs] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });
  const galleryRef = useRef(null);
  const slideLockRef = useRef(false);
  const slideTimeoutRef = useRef(null);
  const isGalleryInView = useInView(galleryRef, { once: true, amount: 0.35 });

  useEffect(() => {
    return () => {
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
      }
    };
  }, []);

  const lockSlide = () => {
    slideLockRef.current = true;

    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
    }

    slideTimeoutRef.current = setTimeout(() => {
      slideLockRef.current = false;
    }, 1200);
  };

  const goToSlide = (step, options = {}) => {
    if (slideLockRef.current) return;

    const { wrap = true } = options;
    lockSlide();
    setSlideDirection(step > 0 ? 1 : -1);
    setCurrentSlide((index) => {
      const nextIndex = wrap
        ? (index + step + gallerySlides.length) % gallerySlides.length
        : Math.min(gallerySlides.length - 1, Math.max(0, index + step));

      return nextIndex;
    });
  };

  const prev = () => goToSlide(-1, { wrap: true });
  const next = () => goToSlide(1, { wrap: true });

  const setSubTab = (slideIndex, tabIndex) => {
    const currentTabIndex = subTabs[slideIndex];

    if (currentTabIndex === tabIndex) {
      return;
    }

    setSubTabs((prevTabs) => ({
      ...prevTabs,
      [slideIndex]: tabIndex,
    }));
  };

  const handleGalleryWheel = (event) => {
    if (!isGalleryInView || Math.abs(event.deltaY) < 28 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;
    const isAtFirstSlide = currentSlide === 0 && direction < 0;
    const isAtLastSlide = currentSlide === gallerySlides.length - 1 && direction > 0;

    if (isAtFirstSlide || isAtLastSlide) {
      return;
    }

    event.preventDefault();
    goToSlide(direction, { wrap: false });
  };

  const galleryRevealVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
  };

  const galleryItemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slidePageVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const slideTextVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const slideCarVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      scale: 0.92,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      scale: 0.92,
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const previewLeftVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 0.18,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const previewRightVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 0.18,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const slideChildrenVariants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      y: 10,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const renderGallerySlide = (slideIndex) => {
    const displayedSlide = gallerySlides[slideIndex];
    const displayedModel = displayedSlide.submodels[subTabs[slideIndex]];
    const previousIndex = (slideIndex - 1 + gallerySlides.length) % gallerySlides.length;
    const nextIndex = (slideIndex + 1) % gallerySlides.length;
    const previousModel = gallerySlides[previousIndex].submodels[subTabs[previousIndex]];
    const nextModel = gallerySlides[nextIndex].submodels[subTabs[nextIndex]];

    return (
      <MotionDiv
        key={slideIndex}
        className={styles.gallerySlideActive}
        variants={slidePageVariants}
        custom={slideDirection}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className={styles.slideStage}>
          <MotionDiv className={styles.slideTexts} variants={slideTextVariants} custom={slideDirection}>
            <div className={styles.slideLogoContainer}>
              <h2 className={styles.slideTitle}>{displayedSlide.title}</h2>
            </div>
            <p className={styles.slideSlogan}>{displayedSlide.slogan}</p>
          </MotionDiv>

          <div className={styles.slideArtwork}>
            <MotionDiv
              className={`${styles.sidePreview} ${styles.sidePreviewLeft}`}
              variants={previewLeftVariants}
              custom={slideDirection}
            >
              <img
                alt={previousModel.name}
                src={previousModel.img}
                className={styles.sidePreviewImage}
              />
            </MotionDiv>

            <MotionDiv
              className={styles.slideImageContainer}
              variants={slideCarVariants}
              custom={slideDirection}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={displayedModel.name}
                  alt={displayedModel.name}
                  src={displayedModel.img}
                  className={styles.slideImage}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </MotionDiv>

            <MotionDiv
              className={`${styles.sidePreview} ${styles.sidePreviewRight}`}
              variants={previewRightVariants}
              custom={slideDirection}
            >
              <img
                alt={nextModel.name}
                src={nextModel.img}
                className={styles.sidePreviewImage}
              />
            </MotionDiv>
          </div>

          <MotionDiv className={styles.slideChildrenContainer} variants={slideChildrenVariants}>
            <div className={styles.tabListWrapper}>
              <ul className={styles.tabList}>
                {displayedSlide.submodels.map((sub, idx) => (
                  <li
                    key={idx}
                    onClick={() => setSubTab(slideIndex, idx)}
                    className={`${styles.tabItem} ${subTabs[slideIndex] === idx ? styles.tabSelected : ""}`}
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.slideActionButtons}>
              <a
                aria-label={`Explore the model ${displayedModel.name}`}
                className={styles.btnExploreSpecial}
                href={displayedModel.exploreLink}
              >
                <span>Explore the model</span>
                <svg aria-hidden="true" className={styles.btnArrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4133 6L15.5553 6.92298L19.6739 11.3473H2V12.6527H19.6739L15.5541 17.077L16.4145 18L22 12L16.4145 6H16.4133Z" fill="currentColor"></path>
                </svg>
              </a>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>
    );
  };

  return (
    <>
    <Navbar transparent={true} />
    <div className={styles.home}>
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
        <span className={styles.categorySub}>Explore the Range</span>
        <h2 className={styles.categoryTitle}>Shop by Category</h2>

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
                <h3 className={styles.categoryLabel}>{cat.label}</h3>
                <span className={styles.categoryAction}>
                  Explore Range 
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MODELS */}
      {/* FAMILIES GALLERY CAROUSEL */}
      <MotionSection
        ref={galleryRef}
        className={styles.familiesGallery}
        initial="hidden"
        animate={isGalleryInView ? "visible" : "hidden"}
        variants={galleryRevealVariants}
        onWheel={handleGalleryWheel}
      >
        <div className={styles.galleryInner}>
          
          {/* Controls */}
          <MotionDiv className={styles.galleryControls} variants={galleryItemVariants}>
            <button onClick={prev} className={styles.controlBtn} aria-label="Previous">
              <svg aria-hidden="true" className={styles.arrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.646 22.354L5.29297 12L15.647 1.646L16.353 2.353L6.70697 12L16.353 21.646L15.646 22.354Z" fill="currentColor"></path>
              </svg>
              <svg className={styles.hexagonBg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.464 58.271">
                <path pathLength="1" d="M50.464 43.992L25.732 58.271 1 43.992V15.434L25.732 1.155l24.732 14.279z" className={styles.hexagon}></path>
              </svg>
            </button>
            <button onClick={next} className={styles.controlBtn} aria-label="Next">
              <svg aria-hidden="true" className={styles.arrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.35397 22.354L7.64697 21.647L17.293 12L7.64697 2.35397L8.35297 1.64697L18.707 12L8.35297 22.354H8.35397Z" fill="currentColor"></path>
              </svg>
              <svg className={styles.hexagonBg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.464 58.271">
                <path pathLength="1" d="M50.464 43.992L25.732 58.271 1 43.992V15.434L25.732 1.155l24.732 14.279z" className={styles.hexagon}></path>
              </svg>
            </button>
          </MotionDiv>

          {/* Active Slide Wrapper */}
          <div className={styles.galleryStageViewport}>
            <AnimatePresence initial={false} mode="sync">
              {renderGallerySlide(currentSlide)}
            </AnimatePresence>
          </div>

        </div>
      </MotionSection>

      {/* E-PERFORMANCE (TAYCAN) */}
      <section className={styles.eperformance}>
        <div className={styles.eperformanceContent}>
          <span className={styles.subTitleLight}>PORSCHE E-PERFORMANCE</span>
          <h2 className={styles.sectionTitleLight}>Electrified Soul.</h2>
          <p className={styles.sectionTextLight}>
            The new Taycan Turbo S. Striking proportions, timeless design, and a perfect blend of performance and everyday usability.
          </p>
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specVal}>761 hp</span>
              <span className={styles.specLabel}>Overboost Power</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specVal}>2.8 s</span>
              <span className={styles.specLabel}>0-100 km/h with Launch Control</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specVal}>412 km</span>
              <span className={styles.specLabel}>Range (WLTP)</span>
            </div>
          </div>
          <a href="/shop" className={styles.btnOutlineLight}>
            Explore Taycan Models
          </a>
        </div>
        <div className={styles.eperformanceImageContainer}>
          <img src={taycanImg} alt="Porsche Taycan Turbo S" className={styles.eperformanceImage} />
        </div>
      </section>

      {/* MACAN ELECTRIC */}
      <section className={styles.macanSection}>
        <div className={styles.macanImageContainer}>
          <img src={macanImg} alt="Porsche Macan Electric" className={styles.macanImage} />
        </div>
        <div className={styles.macanContent}>
          <span className={styles.subTitleDark}>THE NEW MACAN ELECTRIC</span>
          <h2 className={styles.sectionTitleDark}>Keep your essence.</h2>
          <p className={styles.sectionTextDark}>
            All-electric performance in a compact SUV package. Combining Porsche driving dynamics with the utility of an SUV and next-generation connectivity.
          </p>
          <div className={styles.specsGridDark}>
            <div className={styles.specItemDark}>
              <span className={styles.specValDark}>639 hp</span>
              <span className={styles.specLabelDark}>Max Power</span>
            </div>
            <div className={styles.specItemDark}>
              <span className={styles.specValDark}>3.3 s</span>
              <span className={styles.specLabelDark}>0-100 km/h</span>
            </div>
            <div className={styles.specItemDark}>
              <span className={styles.specValDark}>21 min</span>
              <span className={styles.specLabelDark}>10% to 80% Charging</span>
            </div>
          </div>
          <a href="/shop" className={styles.btnOutlineDark}>
            Discover Macan Electric
          </a>
        </div>
      </section>

      <Footer/>
    </div>
    </>
  );
}
