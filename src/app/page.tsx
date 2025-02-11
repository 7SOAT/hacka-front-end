import FileUpload from "./components/FileUpload/FileUpload";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FileUpload />
    </div>
  );
}
