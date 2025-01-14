"use client";

import React from 'react';
import styles from './AuthenticationPanel.module.css';

const AuthenticationPanel = () => {
    return (
        <div className={styles.authPanel}>
            <button className={styles.authButton}>
                Log In
            </button>
            <button className={styles.authButton}>
                Sign Up
            </button>
        </div>
    );
};

export default AuthenticationPanel;
