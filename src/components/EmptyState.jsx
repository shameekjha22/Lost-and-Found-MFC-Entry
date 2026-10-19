import React from 'react';

/**
 * Empty state — PacMan "game over" style.
 */
export default function EmptyState({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Ghost animation */}
      <div className="text-8xl mb-6 animate-bounce select-none" aria-hidden>
        👻
      </div>

      <h2 className="font-pixel text-pacman-yellow text-[0.7rem] sm:text-[0.9rem] mb-3 glow-yellow animate-flicker">
        GAME OVER
      </h2>
      <p className="font-vt text-pacman-yellow/60 text-xl sm:text-2xl mb-2">
        NO ITEMS FOUND IN THIS ZONE
      </p>
      <p className="font-vt text-pacman-border text-lg mb-8">
        Try changing your filters or clearing the search
      </p>

      {/* Dot trail decoration */}
      <div className="flex items-center gap-3 mb-8" aria-hidden>
        {[...Array(7)].map((_, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-pacman-yellow inline-block animate-dot-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <button
        onClick={onClearFilters}
        className="btn-pixel bg-pacman-yellow text-black px-5 py-3 hover:bg-pacman-yellow2 hover:shadow-pacman border-2 border-pacman-yellow text-[0.5rem]"
      >
        ▶ INSERT COIN / CLEAR FILTERS
      </button>
    </div>
  );
}
