import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import AuthField from "./AuthField";
import styles from "./AuthShell.module.css";

export default function VerificationForm({
  email,
  initialResendAfter = 60,
  isSubmitting,
  onBack,
  onResend,
  onVerify,
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendAfter, setResendAfter] = useState(initialResendAfter);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendAfter <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendAfter((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendAfter]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your email.");
      return;
    }

    setError("");
    onVerify(code);
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const response = await onResend();
      if (response) {
        setCode("");
        setError("");
        setResendAfter(response.resendAfter || 60);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.verificationIntro}>
        <span className={styles.verificationIcon} aria-hidden="true">
          <i className="fa-regular fa-envelope"></i>
        </span>
        <p>
          We sent a six-digit verification code to <strong>{email}</strong>. The code
          expires in 10 minutes.
        </p>
      </div>

      <AuthField
        id="verification-code"
        label="Verification Code"
        name="code"
        type="text"
        value={code}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
          setError("");
        }}
        placeholder="000000"
        iconClass="fa-solid fa-shield-halved"
        error={error}
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        pattern="[0-9]{6}"
      />

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? <Loader label="Verifying..." variant="compact" /> : "Verify Code"}
      </button>

      <div className={styles.verificationActions}>
        <button type="button" className={styles.textButton} onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className={styles.textButton}
          disabled={resendAfter > 0 || isResending}
          onClick={handleResend}
        >
          {isResending
            ? "Sending..."
            : resendAfter > 0
              ? `Resend in ${resendAfter}s`
              : "Resend code"}
        </button>
      </div>
    </form>
  );
}
