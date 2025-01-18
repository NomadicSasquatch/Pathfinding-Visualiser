"use client";

import React from 'react';
import styles from './AuthenticationPanel.module.css';

const AuthenticationPanel = ({ setAuthType, setIsAuthOpen}) => {
    const handleLogin = () => {
        setAuthType(`login`);
        setIsAuthOpen(true);
    }

    const handleSignIn = () => {
        setAuthType(`signin`);
        setIsAuthOpen(true);
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
