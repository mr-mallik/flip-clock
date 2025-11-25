import React, { useState, useEffect, useRef } from 'react';
import { TiPlus } from "react-icons/ti";

const TimezoneSelector = ({ onAddClock, selectedTimezones, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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
            text: timezone.text,
            value: timezone.value,
            abbr: timezone.abbr,
            region: utcTimezone.split('/')[0]
          }))
        ).sort((a, b) => a.country.localeCompare(b.country));

        setTimezones(transformedTimezones);
        setError(null);
      } catch (err) {
        console.error('Error fetching timezones:', err);
        setError(err.message);
        // Fallback to a few basic timezones if API fails
        setTimezones([
          { country: 'New York', timezone: 'America/New_York', offset: -5, region: 'America', text: 'Eastern Standard Time', value: 'EST', abbr: 'EST' },
          { country: 'London', timezone: 'Europe/London', offset: 0, region: 'Europe', text: 'Greenwich Mean Time', value: 'GMT', abbr: 'GMT' },
          { country: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9, region: 'Asia', text: 'Japan Standard Time', value: 'JST', abbr: 'JST' },
          { country: 'Sydney', timezone: 'Australia/Sydney', offset: 10, region: 'Australia', text: 'Australian Eastern Standard Time', value: 'AEST', abbr: 'AEST' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezones();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Helper function to format timezone names for display
  const formatTimezoneDisplayName = (timezone) => {
    // Convert timezone string to a more readable format
    const parts = timezone.split('/');
    if (parts.length >= 2) {
      const location = parts[parts.length - 1].replace(/_/g, ' ');
      return location;
    }
    return timezone.replace(/_/g, ' ');
  };

  const availableTimezones = timezones.filter(
    tz => {
      if (!selectedTimezones.includes(tz.timezone)) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          tz.country.toLowerCase().includes(searchTermLower) ||
          tz.timezone.toLowerCase().includes(searchTermLower) ||
          tz.region.toLowerCase().includes(searchTermLower) ||
          (tz.text && tz.text.toLowerCase().includes(searchTermLower)) ||
          (tz.value && tz.value.toLowerCase().includes(searchTermLower)) ||
          (tz.abbr && tz.abbr.toLowerCase().includes(searchTermLower))
        );
      }
      return false;
    }
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm ${isDarkMode
          ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-700 disabled:text-gray-500'
          : 'bg-white hover:bg-gray-50 text-blue-600 border border-blue-100 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
        disabled={loading}
      >
        <TiPlus size={18} />
        <span>{loading ? 'Loading...' : 'Add Clock'}</span>
      </button>

      {error && (
        <div className={`absolute top-full left-0 mt-2 w-64 border rounded-lg p-3 text-sm z-20 shadow-xl ${isDarkMode
          ? 'bg-red-900 border-red-700 text-red-200'
          : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          <p className="font-medium">Error loading timezones:</p>
          <p>{error}</p>
          <p className="mt-1 text-xs">Using fallback timezones.</p>
        </div>
      )}

      {isOpen && !loading && (
        <div className={`absolute top-full left-0 mt-2 w-80 rounded-xl shadow-2xl border z-20 overflow-hidden flex flex-col max-h-[500px] ${isDarkMode
          ? 'glass-dark text-white'
          : 'glass text-gray-800'
          }`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-70">Select Timezone</h3>

            {/* Search input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by city, country, IST, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode
                  ? 'bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
              <svg className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Timezone list */}
          <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
            {availableTimezones.length > 0 ? (
              <div className="space-y-1">
                {availableTimezones.slice(0, 100).map((tz, idx) => (
                  <button
                    key={tz.timezone + idx}
                    onClick={() => handleAddClock(tz.timezone, tz.country)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 group flex justify-between items-center ${isDarkMode
                      ? 'hover:bg-blue-600/30'
                      : 'hover:bg-blue-50'
                      }`}
                  >
                    <div>
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>{tz.country}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{tz.region}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${isDarkMode
                      ? 'bg-gray-800 text-gray-300 group-hover:bg-blue-900 group-hover:text-blue-200'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}>
                      UTC{tz.offset >= 0 ? '+' : ''}{tz.offset}
                    </div>
                  </button>
                ))}
                {availableTimezones.length > 100 && (
                  <div className={`text-xs text-center py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Showing first 100 results. Use search to narrow down.
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm">No timezones found</p>
                {searchTerm && <p className="text-xs mt-1 opacity-70">Try a different search term</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
