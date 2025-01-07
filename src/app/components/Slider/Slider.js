import React, { useState } from 'react';

export default function Slider() {
    
    return (
        <div>
          <h1>Animation Speed</h1>
          <div>
            <label htmlFor="delay-slider">Delay (ms): {sliderValue}</label>
            <input
              id="delay-slider"
              type="range"
              min="10"
              max="2000"
              step="10"
              value={sliderValue}
              onChange={handleSliderChange}
            />
          </div>
          <button onClick={asyncExampleFunction}>Run Async Function</button>
        </div>
      );
}