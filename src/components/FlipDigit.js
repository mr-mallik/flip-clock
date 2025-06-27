import React, { useState, useEffect } from 'react';
import './FlipDigit.css';

const FlipDigit = ({ digit, isDarkMode = false, clockCount = 1 }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 300);

      return () => clearTimeout(timer);
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
      <div className={`flip-card ${isFlipping ? 'flipping' : ''}`}>
        <div className="flip-card-front">
          <span>{currentDigit}</span>
        </div>
        <div className="flip-card-back">
          <span>{nextDigit}</span>
        </div>
      </div>
    </div>
  );
};

export default FlipDigit;
