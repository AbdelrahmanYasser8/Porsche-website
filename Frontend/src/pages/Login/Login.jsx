import { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`${styles.page} d-flex flex-column min-vh-100`}>
      <main className={`${styles.content} flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5`}>
        <div className={`card shadow ${styles.card}`}>
          <div className={`card-body p-4 ${styles.cardBody}`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <h2 className={`text-center mb-4 ${styles.title}`}>Login</h2>

                <div className="mb-3">
                  <label htmlFor="email" className={`form-label ${styles.label}`}>Email Address</label>
                  <div className={`input-group ${styles.inputGroup}`}>
                    <span className="input-group-text bg-light border-end-0">
                      <i className={`fa-regular fa-envelope ${styles.icon}`}></i>
                    </span>
                    <input
                      id="email"
                      type="email"
                      className={`form-control bg-light border-start-0 ${styles.input}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className={`form-label ${styles.label}`}>Password</label>
                  <div className={`input-group ${styles.inputGroup}`}>
                    <span className="input-group-text bg-light border-end-0">
                      <i className={`fa-solid fa-lock ${styles.icon}`}></i>
                    </span>
                    <input
                      id="password"
                      type="password"
                      className={`form-control bg-light border-start-0 ${styles.input}`}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <small className="text-end d-block mt-1">
                    <a href="#" className={styles.forgot}>Forgot password?</a>
                  </small>
                </div>
              </div>

              <div>
                <button type="submit" className={`btn btn-dark w-100 mb-3 ${styles.button}`}>
                  Sign In
                </button>

                <div className="text-center">
                  <span className={styles.label}>Don&apos;t have an account? </span>
                  <a href="/register" className={styles.create}>Create one</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
