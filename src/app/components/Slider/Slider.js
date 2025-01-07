'use client';
import React, { useState } from 'react';
import { useGlobalDelay } from '../GlobalDelayContext/GlobalDelayContext';

export default function Slider() {
    const { delay, setDelay } = useGlobalDelay();

    const handleChange = (e) => {
        setDelay(Number(e.target.value));
    };

    return (
        <div style={{ margin: '10px 0' }}>
            Animation Speed
          <input 
            type="range" 
            min="10"
            max="200"
            value={delay} 
            onChange={handleChange} 
          />
          <span style={{ marginLeft: '8px' }}>{delay} ms</span>
        </div>
      );
};