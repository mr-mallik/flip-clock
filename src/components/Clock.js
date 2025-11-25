import React, { useState, useEffect } from 'react';
import FlipDigit from './FlipDigit';

const Clock = React.memo(({ timezone, country, onRemove, is24Hour, isDarkMode, timeOffset = 0, onTimeAdjust, clockCount = 1, currentTime }) => {
  const [showSlider, setShowSlider] = useState(false);

  // Get the adjusted time based on the offset
  const getAdjustedTime = () => {
    const adjustedTime = new Date(currentTime.getTime() + (timeOffset * 60 * 1000));
    return adjustedTime;
  };

  // Function to determine if it's day or night in the timezone
  const getDayNightStatus = () => {
    const adjustedTime = getAdjustedTime();
    const localTime = adjustedTime.toLocaleString('en-US', {
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
    const adjustedTime = getAdjustedTime();
    const options = {
      timeZone: timezone,
      hour12: !is24Hour,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const timeString = adjustedTime.toLocaleTimeString('en-US', options);

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
    const formatted = formatTime(currentTime);

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

  // Get current time in this timezone for the slider
  const getCurrentTimeInTimezone = () => {
    const adjustedTime = getAdjustedTime();
    const timeInTimezone = new Date(adjustedTime.toLocaleString("en-US", { timeZone: timezone }));
    return {
      hours: timeInTimezone.getHours(),
      minutes: timeInTimezone.getMinutes()
    };
  };

  const handleSliderChange = (event) => {
    const minutes = parseInt(event.target.value);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    onTimeAdjust(hours, mins);
  };

  const getSliderValue = () => {
    const currentTime = getCurrentTimeInTimezone();
    return currentTime.hours * 60 + currentTime.minutes;
  };

  const formatSliderTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (is24Hour) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  // Get dynamic sizing classes based on clock count
  const getSizeClasses = () => {
    if (clockCount === 1) {
      return {
        container: 'h-full flex flex-col justify-center',
        padding: 'p-8 md:p-12 lg:p-16',
        title: 'text-2xl md:text-3xl lg:text-4xl',
        controls: 'mt-6 md:mt-8',
        timezone: 'text-base md:text-lg'
      };
    } else if (clockCount === 2) {
      return {
        container: 'h-full flex flex-col justify-center',
        padding: 'p-6 md:p-8',
        title: 'text-xl md:text-2xl',
        controls: 'mt-4 md:mt-6',
        timezone: 'text-sm md:text-base'
      };
    } else if (clockCount === 3) {
      return {
        container: 'h-full flex flex-col justify-center',
        padding: 'p-4 md:p-6',
        title: 'text-lg md:text-xl',
        controls: 'mt-4',
        timezone: 'text-sm'
      };
    } else {
      return {
        container: 'h-auto',
        padding: 'p-4',
        title: 'text-base md:text-lg',
        controls: 'mt-3',
        timezone: 'text-xs'
      };
    }
  };

  const digits = getTimeDigits();
  const isDay = getDayNightStatus();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`rounded-lg shadow-lg relative w-full transition-colors duration-300 ${sizeClasses.container} ${sizeClasses.padding} ${isDarkMode
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white'
      }`}>
      {/* Day/Night indicator and Remove button */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        {/* Day/Night indicator */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${isDay
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
          className={`transition-colors duration-200 ${isDarkMode
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
      <h3 className={`font-semibold mb-4 text-center mt-6 ${sizeClasses.title} ${isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>{country}</h3>

      {/* Clock display */}
      <div className="flex items-center justify-center space-x-1">
        {/* Hours */}
        <FlipDigit digit={digits.hours[0]} isDarkMode={isDarkMode} clockCount={clockCount} />
        <FlipDigit digit={digits.hours[1]} isDarkMode={isDarkMode} clockCount={clockCount} />

        {/* Separator */}
        <div className={`font-bold mx-2 ${clockCount === 1 ? 'text-4xl md:text-5xl lg:text-6xl' : clockCount <= 3 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>:</div>

        {/* Minutes */}
        <FlipDigit digit={digits.minutes[0]} isDarkMode={isDarkMode} clockCount={clockCount} />
        <FlipDigit digit={digits.minutes[1]} isDarkMode={isDarkMode} clockCount={clockCount} />

        {/* Separator */}
        <div className={`font-bold mx-2 ${clockCount === 1 ? 'text-4xl md:text-5xl lg:text-6xl' : clockCount <= 3 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>:</div>

        {/* Seconds */}
        <FlipDigit digit={digits.seconds[0]} isDarkMode={isDarkMode} clockCount={clockCount} />
        <FlipDigit digit={digits.seconds[1]} isDarkMode={isDarkMode} clockCount={clockCount} />

        {/* AM/PM for 12-hour format */}
        {!is24Hour && digits.period && (
          <div className={`ml-4 font-semibold ${clockCount === 1 ? 'text-2xl md:text-3xl lg:text-4xl' : clockCount <= 3 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {digits.period}
          </div>
        )}
      </div>

      {/* Time Slider */}
      <div className={sizeClasses.controls}>
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setShowSlider(!showSlider)}
            className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            {showSlider ? 'Hide' : 'Adjust'} Time
          </button>
          {timeOffset !== 0 && (
            <div className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
              {timeOffset > 0 ? '+' : ''}{Math.floor(timeOffset / 60)}h {Math.abs(timeOffset % 60)}m
            </div>
          )}
        </div>

        {showSlider && (
          <div className="space-y-2">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1439"
                step="15"
                value={getSliderValue()}
                onChange={handleSliderChange}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDarkMode
                  ? 'bg-gray-700 slider-dark'
                  : 'bg-gray-200 slider-light'
                  }`}
              />

              {/* Hour markers */}
              <div className="relative mt-2 h-4">
                {[...Array(25)].map((_, hour) => {
                  const position = (hour / 24) * 100;
                  const showLabel = hour % 6 === 0; // Show labels at 0, 6, 12, 18, 24

                  return (
                    <div
                      key={hour}
                      className="absolute"
                      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                    >
                      {/* Tick mark */}
                      <div
                        className={`w-px ${showLabel ? 'h-3' : 'h-2'} ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                          }`}
                      />
                      {/* Hour label */}
                      {showLabel && (
                        <div
                          className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}
                          style={{ transform: 'translateX(-50%)', position: 'absolute', left: '50%' }}
                        >
                          {hour}h
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
              {formatSliderTime(getSliderValue())}
            </div>
          </div>
        )}
      </div>

      {/* Timezone info */}
      <div className={`text-center mt-2 ${sizeClasses.timezone} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
        {timezone}
      </div>
    </div>
  );
});

export default Clock;
