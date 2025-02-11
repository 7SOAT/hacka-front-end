"use client";

import { useSearchParams } from "next/navigation";
import FileUpload from "./components/FileUpload/FileUpload";
import styles from "./page.module.css";
import validate from 'uuid-validate';
import { useEffect, useState } from "react";
import { getAccessToken } from "./components/FileUpload/logic";

export default function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (!code || !validate(code)) throw new Error('You need to be authenticated to acces this page!');

  const [token, setToken] = useState<string>('')
  useEffect(() => {
    getAccessToken().then((response) => {
      console.log(response);
      setToken(response);
    });
  })

  if (token) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FileUpload token={token} />
      </div>
    );
  } else {
    throw new Error('Unauthorized!')
  }


}
