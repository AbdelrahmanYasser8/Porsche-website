import { useEffect, useState } from "react";
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="navbar bg-white container-fluid">
        <a className="navbar-brand h1 col fs-3 mx-4" href="#">Porsche</a>
        <div className="col d-flex justify-content-center align-items-center g-0">
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="/home">Home</a>
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="/CarsListing">Shop</a>
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="/about">About</a>
        </div>
        <div className="col d-flex justify-content-end align-items-center">
          <a className="text-decoration-none text-reset" href="#">
            <div className={`d-flex g-0 align-items-center p-1 ${styles.iconHover}`}>
              <i className={`fa-solid fa-cart-shopping fs-5 ${styles.iconHover}`}></i>
              <p className="text-reset m-0">0</p>
            </div>
          </a>
          <div>
            <a className={` mx-4 p-1 text-decoration-none text-reset ${styles.iconHover || ''}`} href="/register">
              <i className={`fa-solid fa-user fs-5 ${styles.iconHover}`}></i>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}