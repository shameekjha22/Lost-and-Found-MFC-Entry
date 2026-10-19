import React from 'react';

/**
 * Animated skeleton card — PacMan arcade style.
 */
export default function SkeletonCard() {
  return (
    <div className="bg-pacman-card border-2 border-pacman-border overflow-hidden flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="h-44 bg-pacman-border/30 relative flex items-center justify-center">
        {/* Ghost silhouette */}
        <span className="text-5xl opacity-10 select-none">👻</span>
        {/* Top badges */}
        <div className="absolute top-2 right-2 h-5 w-16 bg-pacman-border/40 rounded-none" />
        <div className="absolute top-2 left-2  h-5 w-20 bg-pacman-border/40 rounded-none" />
      </div>

      {/* Content placeholder */}
      <div className="p-4 flex flex-col flex-1 border-t-2 border-pacman-border gap-3">
        {/* Title */}
        <div className="h-3 w-3/4 bg-pacman-yellow/20 rounded-none" />
        {/* Description lines */}
        <div className="h-3 w-full bg-pacman-border/30 rounded-none" />
        <div className="h-3 w-2/3 bg-pacman-border/30 rounded-none" />

        {/* Meta */}
        <div className="mt-auto pt-3 border-t border-pacman-border/40 flex flex-col gap-2">
          <div className="h-3 w-1/2 bg-pacman-inky/20 rounded-none" />
          <div className="h-3 w-1/3 bg-pacman-yellow/10 rounded-none" />
        </div>
      </div>
    </div>
  );
}
