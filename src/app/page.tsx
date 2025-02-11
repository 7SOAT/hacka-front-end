'use client';
import { useSearchParams } from "next/navigation";
import FileUpload from "./components/FileUpload/FileUpload";
import styles from "./page.module.css";
import validate from 'uuid-validate';
import { Suspense } from "react";

export default function Search() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (!code || !validate(code)) throw new Error('You need to be authenticated to acces this page!');

  return (
    <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FileUpload />
    </div>
  );


}
