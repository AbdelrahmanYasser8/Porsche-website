
import styles from "./Navbar.module.css";import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Navbar() {

  return (
    <nav className="navbar bg-white border-bottom border-secondary container-fluid">
      
      <a className="navbar-brand h1 col fs-3 mx-4" href="/">
        Porsche
      </a>

      <div className="col d-flex justify-content-center align-items-center">
        <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ""}`} href="/">
          Home
        </a>
        <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ""}`} href="/shop">
          Shop
        </a>
        <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ""}`} href="/about">
          About
        </a>
      </div>

      <div className="col d-flex justify-content-end align-items-center">
        <div className="dropdown mx-4">
          <a
            className="nav-link"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className={`fa-solid fa-user fs-5 ${styles.iconHover}`}></i> 
          </a>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="/profile">
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
}