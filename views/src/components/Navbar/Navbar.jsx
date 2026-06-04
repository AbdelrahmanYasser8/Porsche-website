import styles from "./Navbar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ transparent = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const navClass = `${styles.navbarCustom} ${
    transparent ? styles.transparentNavbar : styles.defaultNavbar
  } navbar navbar-expand-md container-fluid`;

  const brandClass = `${
    transparent ? styles.transparentBrand : styles.defaultBrand
  } ${styles.brand} navbar-brand h1 fs-3`;

  const linkClass = `${
    transparent ? styles.transparentLink : styles.defaultLink
  } ${styles.navLink} nav-link fs-6`;

  const iconClass = `${
    transparent ? styles.transparentIcon : styles.defaultIcon
  } fa-solid fa-user fs-5`;

  const menuClass = `${styles.navbarMenu} ${
    transparent ? styles.transparentMenu : styles.defaultMenu
  } collapse navbar-collapse`;

  const toggleClass = `${styles.menuToggle} ${
    transparent ? styles.transparentToggle : styles.defaultToggle
  } navbar-toggler`;

  const isAdmin = user?.role === "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={navClass}>
      <Link className={brandClass} to="/">
        Porsche
      </Link>

      <button
        className={toggleClass}
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={menuClass} id="mainNavbar">
        <div className={styles.primaryLinks}>
          <Link className={linkClass} to="/">
            Home
          </Link>
          <Link className={linkClass} to="/shop">
            Shop
          </Link>
          <Link className={linkClass} to="/about">
            About
          </Link>
        </div>

        <div className={styles.accountArea}>
          <button
            className={`${styles.themeToggle} ${transparent ? styles.transparentIcon : styles.defaultIcon}`}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <div className={`${styles.accountDropdown} dropdown`}>
            <button
              className={`${styles.accountToggle} nav-link`}
              type="button"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Open account menu"
            >
              <i className={iconClass}></i>
            </button>

            <ul
              className={`${styles.dropdownMenu} dropdown-menu dropdown-menu-end`}
            >
              {user ? (
                <>
                  <li>
                    <Link className={`${styles.dropdownItem} dropdown-item`} to="/profile">
                      <i className="fa-regular fa-user"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className={`${styles.dropdownItem} dropdown-item`} to="/orders">
                      <i className="fa-solid fa-receipt"></i>
                      Orders
                    </Link>
                  </li>
                  {isAdmin ? (
                    <li>
                      <Link className={`${styles.dropdownItem} dropdown-item`} to="/admin/dashboard">
                        <i className="fa-solid fa-gauge-high"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                  ) : null}
                  <li>
                  <button
                    className={`${styles.dropdownItem} dropdown-item`}
                    type="button"
                    onClick={handleLogout}
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link className={`${styles.dropdownItem} dropdown-item`} to="/login">
                    <i className="fa-solid fa-right-to-bracket"></i>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.mobileAccountLinks}>
            <button
              className={`${linkClass} ${styles.mobileAccountLink}`}
              onClick={toggleTheme}
              type="button"
              style={{ background: "none", border: 0, padding: 0, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}
            >
              <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} style={{ width: 18, textAlign: "center" }}></i>
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            {user ? (
              <>
                <Link className={`${linkClass} ${styles.mobileAccountLink}`} to="/profile">
                  <i className="fa-regular fa-user"></i>
                  Profile
                </Link>
                <Link className={`${linkClass} ${styles.mobileAccountLink}`} to="/orders">
                  <i className="fa-solid fa-receipt"></i>
                  Orders
                </Link>
                {isAdmin ? (
                  <Link
                    className={`${linkClass} ${styles.mobileAccountLink}`}
                    to="/admin/dashboard"
                  >
                    <i className="fa-solid fa-gauge-high"></i>
                    Admin Dashboard
                  </Link>
                ) : null}
                <button
                  className={`${linkClass} ${styles.mobileAccountLink}`}
                  type="button"
                  onClick={handleLogout}
                  style={{ background: "none", border: 0, padding: 0, width: "100%", textAlign: "left" }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link className={`${linkClass} ${styles.mobileAccountLink}`} to="/login">
                <i className="fa-solid fa-right-to-bracket"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
