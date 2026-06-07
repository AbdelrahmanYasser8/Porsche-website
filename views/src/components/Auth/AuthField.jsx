import styles from "./AuthField.module.css";

export default function AuthField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  iconClass,
  error,
  helperText,
  autoComplete,
  inputMode,
  maxLength,
  pattern,
  showToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
}) {
  const helpId = helperText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={`${styles.inputGroup} ${error ? styles.inputGroupError : ""}`}>
        <span className={styles.iconWrap} aria-hidden="true">
          <i className={iconClass}></i>
        </span>
        <input
          id={id}
          name={name}
          type={type}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          pattern={pattern}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />

        {showToggle ? (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={onTogglePasswordVisibility}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <i className={`fa-solid ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        ) : null}
      </div>

      {!error && helperText ? (
        <p className={styles.helperText} id={helpId}>
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p className={styles.errorText} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
