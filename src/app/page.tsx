'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FileUpload from "./components/FileUpload/FileUpload";
import styles from "./page.module.css";
import validate from 'uuid-validate';
import { getAccessToken } from "./components/FileUpload/logic";

export default function Search() {
  return (
    <Suspense>
      <Home />
    </Suspense>);
}

function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState<boolean>(false);

  useEffect(() => {
    if (!code || !validate(code)) { throw new Error('eroo') }
    if (err) { throw new Error('eroo') }

    const fetchToken = async () => {
      try {
        const token = await getAccessToken(code);
        setToken(token);
      } catch (error) {
        console.error("Failed to get access token:", error);
        setErr(true)
      }
    };

    fetchToken();
  }, [code, router, err]);

  if (!token) return null; // Evita renderizar a página sem token

  return (
    <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FileUpload token={token} />
    </div>
  );
}
