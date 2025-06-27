import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './components/Clock';
import TimezoneSelector from './components/TimezoneSelector';
import { saveClockData, loadClockData } from './components/storage';

import { TiRefresh, TiTime, TiTimes } from "react-icons/ti";

function App() {
  const [clocks, setClocks] = useState([]);
  const [is24Hour, setIs24Hour] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0); // in minutes from current time

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadClockData();
    // console.log('Loaded saved data:', savedData);
    setClocks(savedData.clocks);
    setIs24Hour(savedData.is24Hour);
    setIsDarkMode(savedData.isDarkMode);
    setIsInitialized(true);
  }, []);

  // Save data whenever clocks, time format, or theme changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      // console.log('Saving data:', { clocks, is24Hour, isDarkMode });
      saveClockData(clocks, is24Hour, isDarkMode);
    }
  }, [clocks, is24Hour, isDarkMode, isInitialized]);

  const addClock = (timezone, country) => {
    const newClock = {
      id: Date.now() + Math.random(),
      timezone,
      country
    };
    setClocks(prev => [...prev, newClock]);
  };

  const removeClock = (clockId) => {
    setClocks(prev => prev.filter(clock => clock.id !== clockId));
  };

  const toggleTimeFormat = () => {
    setIs24Hour(prev => !prev);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleTimeAdjustment = (targetTimezone, newHour, newMinute) => {
    // Calculate the current time in the target timezone
    const now = new Date();
    const currentTimeInTarget = new Date(now.toLocaleString("en-US", {timeZone: targetTimezone}));
    
    // Calculate the desired time
    const desiredTime = new Date(currentTimeInTarget);
    desiredTime.setHours(newHour, newMinute, 0, 0);
    
    // Calculate the offset in minutes
    const offsetMs = desiredTime.getTime() - currentTimeInTarget.getTime();
    const offsetMinutes = Math.floor(offsetMs / (1000 * 60));
    
    setTimeOffset(offsetMinutes);
  };

  const resetTime = () => {
    setTimeOffset(0);
  };

  const clearAllClocks = () => {
    setClocks([]);
    // Don't call clearClockData() here since the useEffect will handle saving the empty array
  };

  const selectedTimezones = clocks.map(clock => clock.timezone);

  // Dynamic grid calculation with responsive design
  const getDynamicGridClass = (clockCount) => {
    if (clockCount === 0) return '';
    if (clockCount === 1) return 'grid grid-cols-1 h-full';
    if (clockCount === 2) return 'grid grid-cols-1 md:grid-cols-2 h-full gap-4';
    if (clockCount === 3) return 'grid grid-cols-1 md:grid-cols-3 h-full gap-4';
    // 4+ clocks: 2 per row on mobile, 2 rows on larger screens
    return 'grid grid-cols-1 sm:grid-cols-2 h-full gap-4';
  };

  // Get container height class based on clock count
  const getContainerClass = (clockCount) => {
    if (clockCount === 0) return 'flex-1';
    return 'flex-1 flex flex-col';
  };

  return (
    <div className={`h-screen transition-colors duration-300 flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-2 h-full flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center py-2 mb-2 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className={`text-lg font-bold mr-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>World Clock</h1>
            {timeOffset !== 0 && (
              <div className={`text-sm px-3 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-blue-900 text-blue-200' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                Time Adjusted: {timeOffset > 0 ? '+' : ''}{Math.floor(timeOffset / 60)}h {Math.abs(timeOffset % 60)}m
              </div>
            )}
            <TimezoneSelector 
              onAddClock={addClock} 
              selectedTimezones={selectedTimezones}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="flex items-center space-x-4">

            {timeOffset !== 0 && (
              <button
                onClick={resetTime}
                className={`duration-200 flex items-center text-sm ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                <TiRefresh size={22} />
                <span>Reset Time</span>
              </button>
            )}

            {clocks.length > 0 && (
              <button
                onClick={toggleTimeFormat}
                className={`duration-200 flex items-center text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                <TiTime size={22} />
                <span>{is24Hour ? '12 Hour' : '24 Hour'}</span>
              </button>
            )}

            {clocks.length > 0 && (
              <button
                onClick={clearAllClocks}
                className={`text-red-500 hover:text-red-600 text-sm transition-colors duration-200 flex items-center`}
              >
                <TiTimes size={22} />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`duration-200 flex items-center text-sm ${isDarkMode ? 'text-yellow-400' : 'text-gray-800'}`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

          </div>
        </header>

        {/* Clock Grid */}
        <div className={`${getContainerClass(clocks.length)}`}>
          {clocks.length > 0 ? (
            <div className={`${getDynamicGridClass(clocks.length)} gap-6 p-4`}>
              {clocks.map((clock) => (
                <Clock
                  key={clock.id}
                  timezone={clock.timezone}
                  country={clock.country}
                  is24Hour={is24Hour}
                  isDarkMode={isDarkMode}
                  timeOffset={timeOffset}
                  onTimeAdjust={(hour, minute) => handleTimeAdjustment(clock.timezone, hour, minute)}
                  onRemove={() => removeClock(clock.id)}
                  clockCount={clocks.length}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🕐</div>
                <h2 className={`text-2xl font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>No Clocks Added Yet</h2>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Click "Add Clock" to get started with your world time collection</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={`text-center text-xs py-4 flex-shrink-0 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>Built with React & Tailwind CSS | Developed by <a target="_blank" rel="noreferrer" href='https://mrmallik.com' className={`${
            isDarkMode ? 'hover:text-blue-400 hover:underline' : 'hover:text-blue-600 hover:underline'
          } transition-colors`}>Gulger Mallik</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;
