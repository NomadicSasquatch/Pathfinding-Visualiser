"use client";

import React, { useState } from 'react';
import styles from './AuthenticationLogic.module.css';

const AuthenticationLogic = ({ authType, setAuthType, isAuthOpen, setIsAuthOpen }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setIsAuthOpen(false);
        setAuthType('');
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      let endpoint;
      if (authType === 'login') {
        endpoint = 'http://localhost:4000/api/auth/login';
      } else {
        endpoint = 'http://localhost:4000/api/auth/register';
      }
    
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
    
        if (!res.ok) {
          setMessage(data.error || 'Something went wrong');
        } else {
          if (authType === 'login') {
            setMessage('Login successful!');
            setToken(data.token);
          } else {
            setMessage(data.msg || 'Registration successful!');
          }
        }
      } catch (error) {
        setMessage(`Network error: ${error.message}`);
      }
    }
    
    return ( 
        isAuthOpen &&
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button onClick={()=>handleClose()} className={styles.closeButton}>X</button>
    
          <h2>{authType === 'login' ? 'Login' : 'Register'}</h2>
    
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Username:</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              {authType === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
    
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    );
};

export default AuthenticationLogic;