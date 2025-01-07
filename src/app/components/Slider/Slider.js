'use client';
import React, { useState } from 'react';
import { useGlobalDelay } from '../GlobalDelayContext/GlobalDelayContext';
import styles from './Slider.module.css';

export default function Slider() {
    const { delay, setDelay } = useGlobalDelay();

    const handleChange = (e) => {
        const reversedValue = 60 - Number(e.target.value);
        setDelay(reversedValue);
        //setChunkSize((-0.225 * delay) + 12.25);
    };

    return (
        <div className={styles.slider}>
            <lable className={styles.text}>Animation Speed</lable>
          <input 
            type="range" 
            min="10"
            max="50"
            value={60 - delay} 
            onChange={handleChange} 
          />
        </div>
      );
};