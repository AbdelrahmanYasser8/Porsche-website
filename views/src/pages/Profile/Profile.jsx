import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthField from "../../components/Auth/AuthField";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import Navbar from "../../components/Navbar/Navbar";
import { useToast } from "../../components/Toast/ToastProvider";
import { useAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";

const initialProfileData = {
  fullName: "",
};

const initialProfileErrors = {
  fullName: "",
};

const initialPasswordData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialPasswordErrors = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialProfileTouched = {
  fullName: false,
};

const initialPasswordTouched = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

function validateProfileForm(values) {
  const nextErrors = {
    fullName: "",
  };

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  }

  return nextErrors;
}

function validatePasswordForm(values) {
  const nextErrors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!values.currentPassword.trim()) {
    nextErrors.currentPassword = "Please enter your current password.";
  }

  if (!values.newPassword.trim()) {
    nextErrors.newPassword = "Please create a new password.";
  } else if (values.newPassword.length < 8) {
    nextErrors.newPassword = "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword.trim()) {
    nextErrors.confirmPassword = "Please confirm your password.";
  } else if (values.newPassword !== values.confirmPassword) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  return nextErrors;
}

function getVisibleError(isSubmitted, touched, field, error) {
  return isSubmitted || touched[field] ? error : "";
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState(initialProfileData);
  const [profileErrors, setProfileErrors] = useState(initialProfileErrors);
  const [profileTouched, setProfileTouched] = useState(initialProfileTouched);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordData, setPasswordData] = useState(initialPasswordData);
  const [passwordErrors, setPasswordErrors] = useState(initialPasswordErrors);
  const [passwordTouched, setPasswordTouched] = useState(initialPasswordTouched);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setProfileData({ fullName: user.name });
      setProfileErrors(validateProfileForm({ fullName: user.name }));
    }
  }, [user]);

  const displayName = profileData.fullName.trim() || user?.name || "Account";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    const nextProfileData = {
      ...profileData,
      [name]: value,
    };

    setProfileData(nextProfileData);
    setProfileErrors(validateProfileForm(nextProfileData));
  };

  const handleProfileBlur = (event) => {
    const { name } = event.target;

    setProfileTouched((current) => ({ ...current, [name]: true }));
    setProfileErrors(validateProfileForm(profileData));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateProfileForm(profileData);
    setProfileSubmitted(true);
    setProfileTouched({ fullName: true });
    setProfileErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const submitProfile = async () => {
      try {
        setProfileSaving(true);
        await updateProfile({ name: profileData.fullName.trim() });
        setProfileSubmitted(false);
        setProfileTouched({ fullName: false });
        showToast({ variant: "success", message: "Profile updated." });
      } catch (error) {
        showToast({
          variant: "danger",
          message: error.message || "Unable to update profile",
        });
      } finally {
        setProfileSaving(false);
      }
    };

    submitProfile();
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    const nextPasswordData = {
      ...passwordData,
      [name]: value,
    };

    setPasswordData(nextPasswordData);
    setPasswordErrors(validatePasswordForm(nextPasswordData));
  };

  const handlePasswordBlur = (event) => {
    const { name } = event.target;

    setPasswordTouched((current) => ({ ...current, [name]: true }));
    setPasswordErrors(validatePasswordForm(passwordData));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validatePasswordForm(passwordData);
    setPasswordSubmitted(true);
    setPasswordTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });
    setPasswordErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const submitPassword = async () => {
      try {
        setPasswordSaving(true);
        await changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        setPasswordData(initialPasswordData);
        setPasswordErrors(initialPasswordErrors);
        setPasswordTouched(initialPasswordTouched);
        setPasswordSubmitted(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        showToast({ variant: "success", message: "Password updated." });
      } catch (error) {
        showToast({
          variant: "danger",
          message: error.message || "Unable to update password",
        });
      } finally {
        setPasswordSaving(false);
      }
    };

    submitPassword();
  };

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
              <h1 className={styles.pageTitle}>My Profile</h1>
            </div>
          </header>

          <div className={styles.layout}>
            <aside className={styles.sidebarCard}>
              <div className={styles.identity}>
                <div className={styles.avatar} aria-hidden="true">
                  {avatarLetter}
                </div>
                <h2 className={styles.identityName}>{displayName}</h2>
              </div>

              <nav className={styles.nav} aria-label="Profile sections">
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) =>
                    `${styles.navButton} ${isActive ? styles.navButtonActive : styles.navButtonInactive}`
                  }
                >
                  <i className="fas fa-user"></i>
                  Profile Settings
                </NavLink>

                <NavLink
                  to="/orders"
                  end
                  className={({ isActive }) =>
                    `${styles.navButton} ${isActive ? styles.navButtonActive : styles.navButtonInactive}`
                  }
                >
                  <i className="fas fa-shopping-bag"></i>
                  Order History
                </NavLink>

                <button
                  type="button"
                  className={`${styles.navButton} ${styles.logoutLink}`}
                  onClick={handleLogout}
                  style={{ background: "none", border: 0, padding: 0, width: "100%", textAlign: "left" }}
                >
                  <i className="fas fa-right-from-bracket"></i>
                  Logout
                </button>
              </nav>
            </aside>

            <section className={styles.mainPane}>
              <div className={styles.panelStack}>
                <section className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Profile details</p>
                      <h2 className={styles.sectionTitle}>Edit Profile</h2>
                    </div>
                  </div>

                  <form className={styles.form} onSubmit={handleProfileSubmit} noValidate>
                    <div className={styles.formGrid}>
                      <AuthField
                        id="profile-full-name"
                        label="Full Name"
                        name="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        onBlur={handleProfileBlur}
                        placeholder="Enter your full name"
                        iconClass="fa-regular fa-user"
                        error={getVisibleError(profileSubmitted, profileTouched, "fullName", profileErrors.fullName)}
                        autoComplete="name"
                      />
                    </div>

                    <div className={styles.actionsRow}>
                      <button type="submit" className={styles.primaryButton} disabled={profileSaving}>
                        {profileSaving ? (
                          <Loader label="Saving..." variant="compact" />
                        ) : (
                          <>
                            <i className="fas fa-floppy-disk"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </section>

                <section className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Security</p>
                      <h2 className={styles.sectionTitle}>Change Password</h2>
                    </div>
                  </div>

                  <form className={styles.form} onSubmit={handlePasswordSubmit} noValidate>
                    <div className={styles.formGrid}>
                      <AuthField
                        id="profile-current-password"
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        placeholder="Enter current password"
                        iconClass="fa-solid fa-lock"
                        error={getVisibleError(passwordSubmitted, passwordTouched, "currentPassword", passwordErrors.currentPassword)}
                        autoComplete="current-password"
                      />

                      <AuthField
                        id="profile-new-password"
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        placeholder="Create a new password"
                        iconClass="fa-solid fa-lock"
                        error={getVisibleError(passwordSubmitted, passwordTouched, "newPassword", passwordErrors.newPassword)}
                        autoComplete="new-password"
                        showToggle
                        isPasswordVisible={showNewPassword}
                        onTogglePasswordVisibility={() => setShowNewPassword((current) => !current)}
                      />

                      <AuthField
                        id="profile-confirm-password"
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        placeholder="Confirm the new password"
                        iconClass="fa-solid fa-lock"
                        error={getVisibleError(passwordSubmitted, passwordTouched, "confirmPassword", passwordErrors.confirmPassword)}
                        autoComplete="new-password"
                        showToggle
                        isPasswordVisible={showConfirmPassword}
                        onTogglePasswordVisibility={() => setShowConfirmPassword((current) => !current)}
                      />
                    </div>

                    <div className={styles.actionsRow}>
                      <button type="submit" className={styles.primaryButton} disabled={passwordSaving}>
                        {passwordSaving ? (
                          <Loader label="Updating..." variant="compact" />
                        ) : (
                          <>
                            <i className="fas fa-lock"></i>
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
