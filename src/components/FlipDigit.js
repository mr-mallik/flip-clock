import React, { useState, useEffect } from 'react';
import './FlipDigit.css';

const FlipDigit = ({ digit, isDarkMode = false }) => {
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

  return (
    <div className={`flip-digit dark`}>
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
