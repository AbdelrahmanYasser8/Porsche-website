import { useState } from 'react';
import styles from './Register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [emailError, setEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false);
  // Only require 8 characters
  const isPasswordValid = formData.password.length >= 8;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'password') {
      setShowPasswordError(false);
    }
    if (name === 'confirmPassword') {
      setShowConfirmPasswordError(false);
    }

    // Email validation on change
    if (name === 'email') {
      if (!value.includes('@')) {
        setEmailError('Enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  // Show confirm password error on blur (e.g., pressing enter/tab out)
  const handleConfirmPasswordBlur = () => {
    if (formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword) {
      setShowConfirmPasswordError(true);
    }
  };

  // Show password error on blur/enter if less than 8 characters
  const handlePasswordBlur = () => {
    if (formData.password.length > 0 && formData.password.length < 8) {
      setShowPasswordError(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Final email validation on submit
    if (!formData.email.includes('@')) {
      setEmailError('Enter a valid email address');
      return;
    }
    // Only check password length
    if (formData.password.length < 8) {
      setShowPasswordError(true);
      return;
    }
    // Confirm password match validation
    if (formData.password !== formData.confirmPassword) {
      setShowConfirmPasswordError(true);
      return;
    }
    // ...existing code for further submit logic...
  };

  return (
    <div className={`${styles.page} d-flex flex-column min-vh-100`}>
      <main className={`${styles.content} flex-grow-1 d-flex justify-content-center align-items-center px-3 py-5`}>
        <form className={`${styles.card} bg-white`} onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Register</h2>

          <div className="mb-4">
            <label htmlFor="fullName" className={`form-label fw-semibold mb-2 ${styles.label}`}>Full Name</label>
            <div className={`input-group ${styles.field}`}>
              <span className="input-group-text bg-light border-end-0">
                <i className={`fa-regular fa-user ${styles.icon}`}></i>
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`form-control bg-light border-start-0 ${styles.input}`}
                placeholder="Username"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="registerEmail" className={`form-label fw-semibold mb-2 ${styles.label}`}>Email Address</label>
            <div className={`input-group ${styles.field}`}>
              <span className="input-group-text bg-light border-end-0">
                <i className={`fa-regular fa-envelope ${styles.icon}`}></i>
              </span>
              <input
                id="registerEmail"
                name="email"
                type="email"
                className={`form-control bg-light border-start-0 ${styles.input}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                aria-describedby="emailHelp"
              />
            </div>
            {emailError && (
              <div className="text-danger small mt-1" id="emailHelp">{emailError}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="registerPassword" className={`form-label fw-semibold mb-2 ${styles.label}`}>Password</label>
            <div className={`input-group ${styles.field}`}>
              <span className="input-group-text bg-light border-end-0">
                <i className={`fa-solid fa-lock ${styles.icon}`}></i>
              </span>
              <input
                id="registerPassword"
                name="password"
                type="password"
                className={`form-control bg-light border-start-0 ${styles.input}`}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handlePasswordBlur}
                aria-describedby="passwordHelp"
              />
            </div>
            {showPasswordError && formData.password.length < 8 && (
              <div className="text-danger small mt-1" id="passwordHelp">Password must be at least 8 characters.</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className={`form-label fw-semibold mb-2 ${styles.label}`}>Confirm Password</label>
            <div className={`input-group ${styles.field}`}>
              <span className="input-group-text bg-light border-end-0">
                <i className={`fa-solid fa-lock ${styles.icon}`}></i>
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-control bg-light border-start-0 ${styles.input}`}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-describedby="confirmPasswordHelp"
                onBlur={handleConfirmPasswordBlur}
              />
            </div>
            {showConfirmPasswordError && formData.password !== formData.confirmPassword && (
              <div className="text-danger small mt-1" id="confirmPasswordHelp">Passwords do not match.</div>
            )}
          </div>

          <div className="form-check mb-4">
            <input
              id="termsCheck"
              name="agreeToTerms"
              type="checkbox"
              className={`form-check-input ${styles.checkbox}`}
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label className={`form-check-label small ${styles.checkboxLabel}`} htmlFor="termsCheck">
              I agree to the <span className={styles.termsText}>Terms of Service</span> and <span className={styles.termsText}>Privacy Policy</span>
            </label>
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>

          <p className={`text-center mt-4 mb-0 small ${styles.signInText}`}>
            Already have an account? <a href="/login" className={styles.signInLink}>Sign In</a>
          </p>
        </form>
      </main>
    </div>
  );
}
