import React, { useState, useEffect } from 'react';

const TimezoneSelector = ({ onAddClock, selectedTimezones, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch timezones from API
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/refs/heads/master/timezones.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timezones');
        }
        
        const data = await response.json();
        
        // Transform the API data to match our expected format
        const transformedTimezones = data.flatMap(timezone => 
          timezone.utc.map(utcTimezone => ({
            country: formatTimezoneDisplayName(utcTimezone),
            timezone: utcTimezone,
            offset: timezone.offset,
            text: timezone.text
          }))
        ).sort((a, b) => a.country.localeCompare(b.country));

        setTimezones(transformedTimezones);
        setError(null);
      } catch (err) {
        console.error('Error fetching timezones:', err);
        setError(err.message);
        // Fallback to a few basic timezones if API fails
        setTimezones([
          { country: 'New York', timezone: 'America/New_York', offset: -5 },
          { country: 'London', timezone: 'Europe/London', offset: 0 },
          { country: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9 },
          { country: 'Sydney', timezone: 'Australia/Sydney', offset: 10 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezones();
  }, []);

  // Helper function to format timezone names for display
  const formatTimezoneDisplayName = (timezone) => {
    // Convert timezone string to a more readable format
    const parts = timezone.split('/');
    if (parts.length >= 2) {
      const location = parts[parts.length - 1].replace(/_/g, ' ');
      const region = parts[0];
      return `${location} (${region})`;
    }
    return timezone.replace(/_/g, ' ');
  };

  const availableTimezones = timezones.filter(
    tz => !selectedTimezones.includes(tz.timezone) && 
          (tz.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
           tz.timezone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClock = (timezone, country) => {
    onAddClock(timezone, country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (isOpen) {
      setSearchTerm('');
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
        <button
            onClick={toggleDropdown}
            className={`text-sm disabled:cursor-not-allowed ${
                isDarkMode 
                ? 'text-white disabled:bg-gray-600' 
                : 'text-gray-800 disabled:bg-gray-400'
            }`}
            disabled={loading || availableTimezones.length === 0}
        >
            <span>{loading ? 'Loading...' : 'Add Clock'}</span>
        </button>

        {error && (
            <div className={`absolute top-full left-0 mt-2 w-64 border rounded-lg p-3 text-sm ${
                isDarkMode 
                ? 'bg-red-900 border-red-700 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
                <p className="font-medium">Error loading timezones:</p>
                <p>{error}</p>
                <p className="mt-1 text-xs">Using fallback timezones.</p>
            </div>
        )}

      {isOpen && !loading && availableTimezones.length > 0 && (
        <div className={`absolute top-full left-0 mt-2 w-80 rounded-lg shadow-lg border z-10 max-h-96 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Select Timezone</h3>
            
            {/* Search input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                autoFocus
              />
            </div>

            {/* Timezone list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableTimezones.slice(0, 50).map((tz, idx) => (
                <button
                  key={tz.timezone + idx}
                  onClick={() => handleAddClock(tz.timezone, tz.country)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-white' 
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{tz.country}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{tz.timezone}</div>
                  {tz.offset !== undefined && (
                    <div className={`text-xs ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>UTC{tz.offset >= 0 ? '+' : ''}{tz.offset}</div>
                  )}
                </button>
              ))}
              {availableTimezones.length > 50 && (
                <div className={`text-xs text-center py-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Showing first 50 results. Use search to narrow down.
                </div>
              )}
              {availableTimezones.length === 0 && searchTerm && (
                <div className={`text-xs text-center py-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No timezones found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default TimezoneSelector;
