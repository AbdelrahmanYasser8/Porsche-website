import { Html } from "@react-three/drei";
import styles from "./Loader.module.css";

function LoaderContent({ label, variant }) {
  return (
    <span className={`${styles.container} ${styles[variant] || ""}`} role="status">
      <span className={styles.loader} aria-hidden="true"></span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  );
}

export default function Loader({ label = "Loading...", variant = "section", canvas = false }) {
  const content = <LoaderContent label={label} variant={variant} />;

  return canvas ? <Html center>{content}</Html> : content;
}
