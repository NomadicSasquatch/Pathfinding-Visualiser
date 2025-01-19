"use client";

import React from 'react';
import styles from './AuthenticationPanel.module.css';

const AuthenticationPanel = ({ handleRunButton, setAuthType, setIsAuthOpen}) => {
    const handleLogin = () => {
        setAuthType(`login`);
        setIsAuthOpen(true);
        handleRunButton();
    }

    const handleSignIn = () => {
        setAuthType(`signin`);
        setIsAuthOpen(true);
        handleRunButton();
    }

    return (
        <div className={styles.authPanel}>
            <button onClick={()=>handleLogin()} className={styles.authButton}>
                Log In
            </button>
            <button onClick={()=>handleSignIn()} className={styles.authButton}>
                Sign In
            </button>
        </div>
    );
};

export default AuthenticationPanel;
