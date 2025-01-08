'use client';
import React, { useState } from 'react';
import { useGlobalDelay } from '../GlobalDelayContext/GlobalDelayContext';
import styles from './Slider.module.css';

export default function Slider() {
    const { delay, setDelay } = useGlobalDelay();

    const handleChange = (e) => {
        const reversedValue = 110 - Number(e.target.value);
        setDelay(reversedValue);
    };

    return (
        <div className={styles.container}>
            <lable className={styles.text}>Animation Speed</lable>
            <div>
                <input 
                type="range" 
                min="50"
                max="100"
                value={110 - delay} 
                onChange={handleChange} 
                className={styles.slider}
            />
                <div className={styles.sliderText}>
                    <span>Slow</span>
                    <span>Fast</span>
                </div>
            </div>
        </div>
      );
};