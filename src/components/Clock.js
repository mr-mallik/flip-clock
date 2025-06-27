import React, { useState, useEffect } from 'react';
import FlipDigit from './FlipDigit';

const Clock = ({ timezone, country, onRemove, is24Hour, isDarkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to determine if it's day or night in the timezone
  const getDayNightStatus = () => {
    const localTime = new Date().toLocaleString('en-US', { 
      timeZone: timezone,
      hour12: false,
      hour: '2-digit'
    });
    const hour = parseInt(localTime.split(' ')[1]?.split(':')[0] || localTime.split(':')[0]);
    
    // Consider 6 AM to 6 PM as day, 6 PM to 6 AM as night
    const isDay = hour >= 6 && hour < 18;
    return isDay;
  };

  const formatTime = (date) => {
    const options = {
      timeZone: timezone,
      hour12: !is24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    const timeString = date.toLocaleTimeString('en-US', options);
    
    if (is24Hour) {
      return timeString;
    } else {
      // For 12-hour format, we need to handle AM/PM
      const parts = timeString.split(' ');
      return {
        time: parts[0],
        period: parts[1]
      };
    }
  };

  const getTimeDigits = () => {
    const formatted = formatTime(time);
    
    if (is24Hour) {
      // 24-hour format: HH:MM:SS
      const digits = formatted.replace(/:/g, '').split('');
      return {
        hours: [digits[0] || '0', digits[1] || '0'],
        minutes: [digits[2] || '0', digits[3] || '0'],
        seconds: [digits[4] || '0', digits[5] || '0']
      };
    } else {
      // 12-hour format: HH:MM:SS AM/PM
      const timeDigits = formatted.time.replace(/:/g, '').split('');
      return {
        hours: [timeDigits[0] || '0', timeDigits[1] || '0'],
        minutes: [timeDigits[2] || '0', timeDigits[3] || '0'],
        seconds: [timeDigits[4] || '0', timeDigits[5] || '0'],
        period: formatted.period
      };
    }
  };

  const digits = getTimeDigits();
  const isDay = getDayNightStatus();

  return (
    <div className={`rounded-lg shadow-lg p-6 relative w-full transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white'
    }`}>
      {/* Day/Night indicator and Remove button */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        {/* Day/Night indicator */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
          isDay 
            ? isDarkMode 
              ? 'bg-yellow-900 text-yellow-200' 
              : 'bg-yellow-100 text-yellow-800'
            : isDarkMode 
              ? 'bg-blue-900 text-blue-200' 
              : 'bg-blue-100 text-blue-800'
        }`}>
          {isDay ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              <span>Day</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <span>Night</span>
            </>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className={`transition-colors duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:text-red-400' 
              : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={`Remove ${country} clock`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Country name */}
      <h3 className={`text-lg font-semibold mb-4 text-center mt-6 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>{country}</h3>
      
      {/* Clock display */}
      <div className="flex items-center justify-center space-x-1">
        {/* Hours */}
        <FlipDigit digit={digits.hours[0]} isDarkMode={isDarkMode} />
        <FlipDigit digit={digits.hours[1]} isDarkMode={isDarkMode} />
        
        {/* Separator */}
        <div className={`text-3xl font-bold mx-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>:</div>
        
        {/* Minutes */}
        <FlipDigit digit={digits.minutes[0]} isDarkMode={isDarkMode} />
        <FlipDigit digit={digits.minutes[1]} isDarkMode={isDarkMode} />
        
        {/* Separator */}
        <div className={`text-3xl font-bold mx-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>:</div>
        
        {/* Seconds */}
        <FlipDigit digit={digits.seconds[0]} isDarkMode={isDarkMode} />
        <FlipDigit digit={digits.seconds[1]} isDarkMode={isDarkMode} />
        
        {/* AM/PM for 12-hour format */}
        {!is24Hour && digits.period && (
          <div className={`ml-4 text-xl font-semibold ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {digits.period}
          </div>
        )}
      </div>
      
      {/* Timezone info */}
      <div className={`text-sm text-center mt-2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {timezone}
      </div>
    </div>
  );
};

export default Clock;
