import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./ToastProvider.module.css";

const ToastContext = createContext(null);

const defaultDurations = {
  success: 3500,
  danger: 5500,
  info: 4000,
  secondary: 4000,
};

const defaultTitles = {
  success: "Success",
  danger: "Error",
  info: "Info",
  secondary: "Notice",
};

let toastCounter = 0;

function getToastDuration(variant, duration) {
  if (duration === null) {
    return null;
  }

  if (typeof duration === "number") {
    return duration;
  }

  return defaultDurations[variant] ?? 4000;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ message, title, variant = "success", duration }) => {
    const id = `toast-${Date.now()}-${toastCounter += 1}`;
    const nextToast = {
      id,
      message,
      title: title || defaultTitles[variant] || "Notice",
      variant,
    };

    setToasts((currentToasts) => [...currentToasts, nextToast]);

    const timeoutMs = getToastDuration(variant, duration);
    if (timeoutMs !== null) {
      const timerId = window.setTimeout(() => {
        timersRef.current.delete(id);
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
      }, timeoutMs);

      timersRef.current.set(id, timerId);
    }

    return id;
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite" aria-relevant="additions removals">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={`${styles.toast} ${styles[`toast${toast.variant[0].toUpperCase()}${toast.variant.slice(1)}`] || ""}`}
          role={toast.variant === "danger" ? "alert" : "status"}
          aria-atomic="true"
        >
          <div className={styles.icon} aria-hidden="true">
            <i
              className={
                toast.variant === "success"
                  ? "fa-solid fa-circle-check"
                  : toast.variant === "danger"
                    ? "fa-solid fa-triangle-exclamation"
                    : toast.variant === "secondary"
                      ? "fa-regular fa-bell"
                      : "fa-solid fa-circle-info"
              }
            />
          </div>

          <div className={styles.content}>
            <p className={styles.title}>{toast.title}</p>
            <p className={styles.message}>{toast.message}</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </article>
      ))}
    </div>
  );
}
