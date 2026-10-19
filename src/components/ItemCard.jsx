import React from 'react';

/**
 * Ghost-colored status badge styles.
 * Blinky (red)  = Lost
 * Inky  (cyan)  = Found
 * Pinky (pink)  = Claimed
 */
function getStatusStyles(status) {
  switch (status) {
    case 'Lost':
      return {
        badge: 'bg-pacman-blinky/20 text-pacman-blinky border border-pacman-blinky/50',
        glow:  'shadow-ghost-red',
        ghost: '🔴',
      };
    case 'Found':
      return {
        badge: 'bg-pacman-inky/20 text-pacman-inky border border-pacman-inky/50',
        glow:  'shadow-ghost-cyan',
        ghost: '🔵',
      };
    case 'Claimed':
      return {
        badge: 'bg-pacman-pinky/20 text-pacman-pinky border border-pacman-pinky/50',
        glow:  'shadow-ghost-pink',
        ghost: '🟣',
      };
    default:
      return {
        badge: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        glow:  '',
        ghost: '⚪',
      };
  }
}

/**
 * Category icon mapping.
 */
function getCategoryIcon(category) {
  const icons = {
    Accessories: '🎒',
    Electronics: '📱',
    Books:       '📚',
    Clothing:    '👕',
    Keys:        '🔑',
    Other:       '📦',
  };
  return icons[category] || '📦';
}

/**
 * Date formatter.
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });
}

/**
 * Individual item card — retro PacMan arcade style.
 */
export default function ItemCard({ item }) {
  const { id, name, category, location, date, status, image, description } = item;
  const imageSrc = image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
  const { badge, glow, ghost } = getStatusStyles(status);

  return (
    <article
      className={`
        bg-pacman-card border-2 border-pacman-border overflow-hidden
        transition-all duration-200
        hover:border-pacman-yellow hover:${glow} hover:-translate-y-1
        flex flex-col group cursor-default
      `}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-black flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Scanline overlay for retro effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          }}
        />

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`font-pixel text-[0.45rem] px-2 py-1 ${badge} backdrop-blur-sm`}>
            {ghost} {status.toUpperCase()}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="font-vt text-sm bg-black/70 text-pacman-yellow border border-pacman-border px-2 py-0.5 backdrop-blur-sm">
            {getCategoryIcon(category)} {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t-2 border-pacman-border">
        <h3 className="font-pixel text-pacman-yellow text-[0.6rem] mb-2 line-clamp-1 leading-relaxed group-hover:glow-yellow transition-all">
          {name}
        </h3>

        {description && (
          <p className="font-vt text-pacman-yellow/70 text-base mb-3 line-clamp-2 leading-snug">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto pt-3 border-t border-pacman-border/50 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-vt text-pacman-inky text-base">
            <span>📍</span>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 font-vt text-pacman-yellow/60 text-base">
            <span>📅</span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
