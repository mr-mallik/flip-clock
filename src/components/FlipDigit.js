import React, { useState, useEffect, useRef } from 'react';
import './FlipDigit.css';

const FlipDigit = React.memo(({ digit, isDarkMode = false, clockCount = 1 }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);

      // Clear any existing timer to prevent race conditions
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 600); // Match CSS transition duration

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [digit, currentDigit]);

  // Get size class based on clock count
  const getSizeClass = () => {
    if (clockCount === 1) return 'flip-digit-large';
    if (clockCount <= 3) return 'flip-digit-medium';
    return 'flip-digit-small';
  };

  return (
    <div className={`flip-digit ${isDarkMode ? 'dark' : ''} ${getSizeClass()}`}>
      {/* Static Top (Next Digit) - Visible when flipper goes down */}
      <div className="digit-half top">
        <span>{nextDigit}</span>
      </div>

      {/* Static Bottom (Current Digit) - Visible until covered by flipper */}
      <div className="digit-half bottom">
        <span>{currentDigit}</span>
      </div>

      {/* The Flipper */}
      <div className={`flipper ${isFlipping ? 'flipping' : ''}`}>
        {/* Front Face (Top Current) - Visible initially */}
        <div className="flipper-face front">
          <span>{currentDigit}</span>
        </div>

        {/* Back Face (Bottom Next) - Visible after flip */}
        <div className="flipper-face back">
          <span>{nextDigit}</span>
        </div>
      </div>
    </div>
  );
});

export default FlipDigit;
