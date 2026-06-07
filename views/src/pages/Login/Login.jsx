import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthField from "../../components/Auth/AuthField";
import AuthShell from "../../components/Auth/AuthShell";
import VerificationForm from "../../components/Auth/VerificationForm";
import Loader from "../../components/Loader/Loader";
import authStyles from "../../components/Auth/AuthShell.module.css";
import { validateLogin } from "../../components/Auth/authValidation";
import { useToast } from "../../components/Toast/ToastProvider";
import { useAuth } from "../../context/AuthContext";

const initialValues = {
  email: "",
  password: "",
};

const initialTouched = {
  email: false,
  password: false,
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, resendCode, verifyCode } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState(validateLogin(initialValues));
  const [touched, setTouched] = useState(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenge, setChallenge] = useState(null);

  const isVisible = (field) => submitted || touched[field];

  useEffect(() => {
    if (!user) {
      return;
    }

    navigate(user.role === "Admin" ? "/admin/dashboard" : "/", { replace: true });
  }, [navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = {
      ...formData,
      [name]: value,
    };

    setFormData(nextValues);
    setErrors(validateLogin(nextValues));
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validateLogin(formData));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateLogin(formData);
    setSubmitted(true);
    setTouched({ email: true, password: true });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const submitLogin = async () => {
      try {
        setIsSubmitting(true);
        const response = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
        setChallenge(response);
        showToast({
          variant: "success",
          message: "Verification code sent to your email",
        });
      } catch (error) {
        showToast({
          variant: "danger",
          message: error.message || "Unable to sign in",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    submitLogin();
  };

  const handleVerify = async (code) => {
    try {
      setIsSubmitting(true);
      const nextUser = await verifyCode({
        challengeToken: challenge.challengeToken,
        code,
      });
      const redirectPath = location.state?.from?.pathname || "/";
      navigate(nextUser?.role === "Admin" ? "/admin/dashboard" : redirectPath, {
        replace: true,
      });
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to verify the code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendCode({
        challengeToken: challenge.challengeToken,
      });
      setChallenge(response);
      showToast({ variant: "success", message: "A new code was sent" });
      return response;
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to resend the code",
      });
      return null;
    }
  };

  if (challenge) {
    return (
      <AuthShell title="Check your email" subtitle="One more step to secure your account.">
        <VerificationForm
          email={challenge.email}
          initialResendAfter={challenge.resendAfter}
          isSubmitting={isSubmitting}
          onBack={() => setChallenge(null)}
          onResend={handleResend}
          onVerify={handleVerify}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Login">
      <form className={authStyles.form} onSubmit={handleSubmit} noValidate>
        <div className={authStyles.fieldGroup}>
          <AuthField
            id="login-email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            iconClass="fa-regular fa-envelope"
            error={isVisible("email") ? errors.email : ""}
            autoComplete="email"
            inputMode="email"
          />

          <AuthField
            id="login-password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            iconClass="fa-solid fa-lock"
            error={isVisible("password") ? errors.password : ""}
            autoComplete="current-password"
            showToggle
            isPasswordVisible={showPassword}
            onTogglePasswordVisibility={() => setShowPassword((current) => !current)}
          />
        </div>

        <button type="submit" className={authStyles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? <Loader label="Signing in..." variant="compact" /> : "Sign In"}
        </button>

        <p className={authStyles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={authStyles.footerLink}>
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
