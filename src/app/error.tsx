"use client";

import './error.css'
import { useEffect } from 'react';

export function ErrorPage() {
    // useEffect(() => {
    //     window.location.href = process.env.NEXT_PUBLIC_AWS_COGNITO_LOGIN_PAGE!;
    // }, []);

    return (
        <div>
            <h1>Redirecting to Cognito login page...</h1>
        </div>
    );
};

export default ErrorPage;