import { useState, useEffect, useRef, useMemo } from 'react';

// Debounce hook — delays value updates to reduce re-renders
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const SearchField = ({ countries, setSelectedCountry, search, setSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef(null);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the search query (150ms) to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(search, 150);

  // Filter countries based on debounced input
  const results = useMemo(() => {
    if (debouncedSearch === '') return [];
    const q = debouncedSearch.toLowerCase();
    return countries.filter(country =>
      country.name.common.toLowerCase().includes(q)
    );
  }, [debouncedSearch, countries]);

  // Show dropdown when there's a search query
  useEffect(() => {
    setIsOpen(search !== '');
    setHighlightIdx(-1);
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCountry = (result) => {
    setSelectedCountry(result);
    setSearch('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      selectCountry(results[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && resultsRef.current) {
      const buttons = resultsRef.current.querySelectorAll('button');
      if (buttons[highlightIdx]) {
        buttons[highlightIdx].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIdx]);

  const resultCount = results.length;

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          className="input-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search !== '' && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search countries..."
          aria-label="Search countries"
          aria-expanded={isOpen && resultCount > 0}
          aria-autocomplete="list"
          aria-controls="search-results"
          role="combobox"
        />
        {search !== '' && (
          <button
            className="search-clear-btn"
            onClick={() => { setSearch(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && search !== '' && (
        <div className="results-box" ref={resultsRef} role="listbox" id="search-results">
          {resultCount > 0 ? (
            <>
              <div className="results-count" aria-live="polite">
                {resultCount} {resultCount === 1 ? 'country' : 'countries'} found
              </div>
              {results.map((result, idx) => (
                <button
                  key={result.name.common}
                  role="option"
                  aria-selected={idx === highlightIdx}
                  className={`result-item${idx === highlightIdx ? ' result-highlighted' : ''}`}
                  onClick={() => selectCountry(result)}
                  onMouseEnter={() => setHighlightIdx(idx)}
                >
                  <span className="result-flag">{result.flag}</span>
                  <span className="result-name">{result.name.common}</span>
                  <span className="result-region">{result.region}</span>
                </button>
              ))}
            </>
          ) : (
            <div className="no-results">
              <span className="no-results-icon">🌍</span>
              No countries found for "{debouncedSearch}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchField;
