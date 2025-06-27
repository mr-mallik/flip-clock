import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './components/Clock';
import TimezoneSelector from './components/TimezoneSelector';
import { saveClockData, loadClockData, clearClockData } from './components/storage';

function App() {
  const [clocks, setClocks] = useState([]);
  const [is24Hour, setIs24Hour] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadClockData();
    setClocks(savedData.clocks);
    setIs24Hour(savedData.is24Hour);
    setIsDarkMode(savedData.isDarkMode || false);
  }, []);

  // Save data whenever clocks, time format, or theme changes
  useEffect(() => {
    saveClockData(clocks, is24Hour, isDarkMode);
  }, [clocks, is24Hour, isDarkMode]);

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

  const clearAllClocks = () => {
    setClocks([]);
    clearClockData();
  };

  const selectedTimezones = clocks.map(clock => clock.timezone);

  // Dynamic grid calculation
  const getDynamicGridClass = (clockCount) => {
    if (clockCount === 0) return '';
    if (clockCount === 1) return 'grid grid-cols-1';
    if (clockCount === 2) return 'grid grid-cols-2';
    if (clockCount === 3) return 'grid grid-cols-3';
    return 'grid grid-cols-4'; // 4 or more clocks
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>World Flip Clocks</h1>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Beautiful digital clocks with flip animations from around the world</p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <TimezoneSelector 
            onAddClock={addClock} 
            selectedTimezones={selectedTimezones}
            isDarkMode={isDarkMode}
          />
          
          <button
            onClick={toggleTimeFormat}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{is24Hour ? '12 Hour' : '24 Hour'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 ${
              isDarkMode 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                : 'bg-gray-700 hover:bg-gray-800 text-white'
            }`}
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
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {clocks.length > 0 && (
            <button
              onClick={clearAllClocks}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Clock Grid */}
        {clocks.length > 0 ? (
          <div className={`${getDynamicGridClass(clocks.length)} gap-6`}>
            {clocks.map((clock) => (
              <Clock
                key={clock.id}
                timezone={clock.timezone}
                country={clock.country}
                is24Hour={is24Hour}
                isDarkMode={isDarkMode}
                onRemove={() => removeClock(clock.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🕐</div>
            <h2 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>No Clocks Added Yet</h2>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Click "Add Clock" to get started with your world time collection</p>
          </div>
        )}

        {/* Footer */}
        <footer className={`text-center mt-16 text-sm gap-2 flex flex-col ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>Built with React & Tailwind CSS | Developed by <a href='https://mrmallik.com' className={`${
            isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
          } transition-colors`}>Gulger Mallik</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;
