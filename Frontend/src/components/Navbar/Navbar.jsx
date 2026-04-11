import styles from './Navbar.module.css';
import cartIcon from '../../assets/icons/cart.png';
import accountIcon from '../../assets/icons/account.png';

export default function Navbar() {
  return (
    <>
      <nav className="navbar bg-white container-fluid">
        <a className="navbar-brand h1 col fs-3 mx-4" href="#">Porsche</a>
        <div className="col d-flex justify-content-center align-items-center g-0">
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="#">Home</a>
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="#">Shop</a>
          <a className={`nav-link mx-4 fs-6 p-1 ${styles.linkHover || ''}`} href="#">About</a>
        </div>
        <div className="col d-flex justify-content-end align-items-center">
          <a className="text-decoration-none text-reset" href="#">
            <div className={`d-flex g-0 align-items-center p-1 ${styles.iconHover}`}>
              <img src={cartIcon} alt="cart icon" style={{ width: '22px', height: '22px' }} />
              <p className="text-reset m-0">0</p>
            </div>
          </a>
          <div>
            <a className={` mx-4 p-1 ${styles.iconHover || ''}`} href="#">
              <img src={accountIcon} alt="account icon" style={{ width: '20px', height: '20px' }} />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}