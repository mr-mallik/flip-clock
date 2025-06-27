// Local storage utilities for managing clock data
const STORAGE_KEY = 'flip-clock-data';

export const saveClockData = (clocks, is24Hour, isDarkMode) => {
  try {
    const data = {
      clocks,
      is24Hour,
      isDarkMode,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving clock data:', error);
  }
};

export const loadClockData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        clocks: parsed.clocks || [],
        is24Hour: parsed.is24Hour !== undefined ? parsed.is24Hour : true,
        isDarkMode: parsed.isDarkMode !== undefined ? parsed.isDarkMode : false
      };
    }
  } catch (error) {
    console.error('Error loading clock data:', error);
  }
  
  // Return default data if no saved data or error
  return {
    clocks: [],
    is24Hour: true,
    isDarkMode: false
  };
};

export const clearClockData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing clock data:', error);
  }
};
