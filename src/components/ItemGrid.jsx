import React from 'react';
import ItemCard from './ItemCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';

/**
 * Responsive item grid with PacMan loading and empty states.
 */
export default function ItemGrid({ items, isLoading, onClearFilters }) {
  if (isLoading) {
    return (
      <div>
        {/* Loading label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-pixel text-pacman-yellow text-[0.5rem] animate-flicker">
            LOADING...
          </span>
          <span className="font-vt text-pacman-yellow/50 text-lg">PLEASE WAIT</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
