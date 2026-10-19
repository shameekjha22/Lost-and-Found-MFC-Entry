import React from 'react';

/**
 * Search bar — PacMan retro style.
 * Parent controls the raw value; debouncing is done in App via useDebounce.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      {/* PacMan search icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-5 h-5">
          <circle cx="50" cy="50" r="48" fill="#FFE000" />
          <polygon points="50,50 100,20 100,80" fill="black" />
          <circle cx="55" cy="26" r="7" fill="black" />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH ITEMS..."
        className="
          w-full bg-pacman-card border-2 border-pacman-border
          text-pacman-yellow placeholder-pacman-yellow/30
          font-vt text-xl
          pl-11 pr-10 py-3
          focus:outline-none focus:border-pacman-yellow focus:shadow-pacman
          transition-all duration-200
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-pacman-yellow/50 hover:text-pacman-yellow transition-colors font-pixel text-[0.5rem]"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
