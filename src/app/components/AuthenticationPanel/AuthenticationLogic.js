"use client";

import React, { useState, useEffect } from 'react';
import styles from './AuthenticationLogic.module.css';

const AuthenticationLogic = ({ hasStart, hasEnd, handleRunButton, authType, setAuthType, isAuthOpen, setIsAuthOpen, setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleClose = () => {
        if(hasStart && hasEnd) {
          handleRunButton();
        }
        setIsAuthOpen(false);
        setAuthType('');
        setMessage('');
        setUsername('');
        setPassword('');
    }
    
    // so window can be closed using esc 
    useEffect(() => {
      const handleKeyDown = (e) => {
        if(e.key === 'Escape' && isAuthOpen) {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAuthOpen, handleClose]);
  
    if(!isAuthOpen) return null;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      let endpoint;
      if(authType === 'login') {
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
    
        if(!res.ok) {
          setMessage(data.error || 'Something went wrong');
        } else {
          if(authType === 'login') {
            setMessage('Login successful!');
            setIsLoggedIn(true);
            localStorage.setItem('token', data.token);
          } else {
            setMessage(data.msg || 'Registration successful!');
          }
          setTimeout(()=> {
            handleClose();
          }, 3000);
        }
      } catch (error) {
        setMessage(`Network error: ${error.message}`);
      }
    }
    
    return ( 
        isAuthOpen &&
      <div className={styles.modalBackdrop}>
        <div className={styles.authWindow}>
          <div>
              <div className={styles.topRow}>
              <h2 className={styles.displayHeader}>{authType === 'login' ? 'Login' : 'Register'}</h2>
              <button onClick={()=>handleClose()} className={styles.closeButton}>X</button>
            </div>
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
              <button type="submit" style={{marginLeft: 250}}>
                {authType === 'login' ? 'Login' : 'Sign In'}
              </button>
            </form>
      
            {message && <p className={styles.message}>{message}</p>}
          </div>
          <div>
              {username}
          </div>
        </div>
      </div>
    );
};

export default AuthenticationLogic;