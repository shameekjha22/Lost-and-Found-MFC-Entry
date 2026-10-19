import React from 'react';

/**
 * Sticky top navbar — PacMan retro theme.
 */
export default function Navbar({ onReportItem }) {
  return (
    <header className="sticky top-0 z-40 bg-black border-b-2 border-pacman-border shadow-lg shadow-pacman-yellow/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            {/* Animated PacMan SVG */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#FFE000" />
                {/* mouth — animates via CSS on the polygon */}
                <polygon
                  points="50,50 100,15 100,85"
                  fill="black"
                  className="origin-center"
                  style={{ animation: 'chomp 0.35s steps(2) infinite' }}
                />
                {/* Eye */}
                <circle cx="55" cy="25" r="7" fill="black" />
              </svg>
            </div>

            <div className="leading-none">
              <span className="font-pixel text-pacman-yellow text-[0.55rem] sm:text-[0.65rem] tracking-tight glow-yellow">
                PAC BOARD
              </span>
              <p className="font-vt text-pacman-border text-sm sm:text-base tracking-widest mt-0.5 hidden sm:block">
                CAMPUS LOST &amp; FOUND
              </p>
            </div>
          </div>

          {/* Ghost icons row (decorative) */}
          <div className="hidden md:flex items-center gap-2 text-xl select-none" aria-hidden>
            <span title="Blinky">👻</span>
            <span className="w-3 h-3 rounded-full bg-pacman-yellow animate-dot-pulse inline-block" />
            <span className="w-3 h-3 rounded-full bg-pacman-yellow animate-dot-pulse inline-block" style={{ animationDelay: '0.2s' }} />
            <span className="w-3 h-3 rounded-full bg-pacman-yellow animate-dot-pulse inline-block" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* CTA */}
          <button
            onClick={onReportItem}
            className="btn-pixel bg-pacman-yellow text-black px-3 py-2.5 hover:bg-pacman-yellow2 hover:shadow-pacman border-2 border-pacman-yellow text-[0.5rem] sm:text-[0.55rem]"
          >
            + REPORT ITEM
          </button>
        </div>
      </div>
    </header>
  );
}
