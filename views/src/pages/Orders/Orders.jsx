import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import OrderHistory from "../../components/Orders/OrderHistory";
import { useAuth } from "../../context/AuthContext";
import styles from "./Orders.module.css";
import profileStyles from "../Profile/Profile.module.css";

export default function Orders() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || "Account";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.content}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Account</p>
              <h1 className={styles.pageTitle}>Order History</h1>
              <p className={styles.pageSubtitle}>
                Review your previous vehicle orders, status updates, and item details in a dedicated view.
              </p>
            </div>
          </header>

          <div className={profileStyles.layout}>
            <aside className={profileStyles.sidebarCard}>
              <div className={profileStyles.identity}>
                <div className={profileStyles.avatar} aria-hidden="true">
                  {avatarLetter}
                </div>
                <h2 className={profileStyles.identityName}>{displayName}</h2>
              </div>

              <nav className={profileStyles.nav} aria-label="Account sections">
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) =>
                    `${profileStyles.navButton} ${isActive ? profileStyles.navButtonActive : profileStyles.navButtonInactive}`
                  }
                >
                  <i className="fas fa-user"></i>
                  Profile Settings
                </NavLink>

                <NavLink
                  to="/orders"
                  end
                  className={({ isActive }) =>
                    `${profileStyles.navButton} ${isActive ? profileStyles.navButtonActive : profileStyles.navButtonInactive}`
                  }
                >
                  <i className="fas fa-shopping-bag"></i>
                  Order History
                </NavLink>

                <button
                  type="button"
                  className={`${profileStyles.navButton} ${profileStyles.logoutLink}`}
                  onClick={handleLogout}
                  style={{ background: "none", border: 0, padding: 0, width: "100%", textAlign: "left" }}
                >
                  <i className="fas fa-right-from-bracket"></i>
                  Logout
                </button>
              </nav>
            </aside>

            <section className={profileStyles.mainPane}>
              <OrderHistory showIntro={false} />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
