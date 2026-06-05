import { Html } from "@react-three/drei";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <Html center>
      <div className={styles.container} role="status" aria-label="Loading 3D model">
        <span className={styles.loader} aria-hidden="true"></span>
        <span className={styles.label}>Loading 3D model</span>
      </div>
    </Html>
  );
}
