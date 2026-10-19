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
 * - For FOUND items: "CLICK TO CLAIM ITEM" (opens claim flow with Reg No & Room No).
 * - For LOST items: "I FOUND THIS ITEM" (opens report found flow).
 * - For CLAIMED items: Locked & non-clickable.
 */
export default function ItemCard({ item, onClaimClick, onReportFoundClick }) {
  const { id, name, category, location, date, status, image, description, claimedBy, founder } = item;
  const imageSrc = image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
  const { badge, glow, ghost } = getStatusStyles(status);
  const isClaimed = status === 'Claimed';
  const isFound = status === 'Found';
  const isLost = status === 'Lost';

  const handleClick = () => {
    if (isFound && onClaimClick) {
      onClaimClick(item);
    } else if (isLost && onReportFoundClick) {
      onReportFoundClick(item);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`
        bg-pacman-card border-2 border-pacman-border overflow-hidden
        transition-all duration-200 flex flex-col group
        ${isClaimed 
          ? 'opacity-70 cursor-not-allowed border-gray-800' 
          : `hover:border-pacman-yellow hover:${glow} hover:-translate-y-1 cursor-pointer`}
      `}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-black flex-shrink-0">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isClaimed ? 'grayscale opacity-50' : 'group-hover:scale-105 opacity-85 group-hover:opacity-100'
          }`}
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

        {/* Claimed Overlay watermark if already claimed */}
        {isClaimed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="font-pixel text-[0.6rem] text-pacman-pinky border-2 border-pacman-pinky px-3 py-1.5 -rotate-12 bg-black/80 shadow-ghost-pink">
              🔒 ALREADY CLAIMED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t-2 border-pacman-border">
        <h3 className={`font-pixel text-[0.6rem] mb-2 line-clamp-1 leading-relaxed transition-all ${
          isClaimed ? 'text-gray-400' : 'text-pacman-yellow group-hover:glow-yellow'
        }`}>
          {name}
        </h3>

        {description && (
          <p className="font-vt text-pacman-yellow/70 text-base mb-3 line-clamp-2 leading-snug">
            {description}
          </p>
        )}

        {/* Claimed Details banner */}
        {isClaimed && claimedBy && (
          <div className="mb-3 p-2 bg-pacman-pinky/10 border border-pacman-pinky/30 font-vt text-sm text-pacman-pinky">
            <p>✓ Claimed by: {claimedBy.name || 'Student'} ({claimedBy.regNo})</p>
            <p>🏠 Room: {claimedBy.roomNo}</p>
          </div>
        )}

        {/* Found Handover banner */}
        {isFound && founder && (
          <div className="mb-3 p-2 bg-pacman-inky/10 border border-pacman-inky/30 font-vt text-sm text-pacman-inky">
            <p>ℹ Handed over at: {founder.depositedAt}</p>
            <p>Found by: {founder.name} ({founder.regNo})</p>
          </div>
        )}

        {/* Meta & Action CTA */}
        <div className="mt-auto pt-3 border-t border-pacman-border/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-base font-vt">
            <div className="flex items-center gap-1.5 text-pacman-inky truncate">
              <span>📍</span>
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1 text-pacman-yellow/60 flex-shrink-0">
              <span>📅</span>
              <span>{formatDate(date)}</span>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="pt-2">
            {isClaimed ? (
              <div className="w-full text-center py-1.5 font-pixel text-[0.4rem] text-gray-500 border border-gray-800 bg-gray-950">
                LOCKED / CLAIMED
              </div>
            ) : isFound ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClaimClick) onClaimClick(item);
                }}
                className="w-full py-1.5 font-pixel text-[0.45rem] bg-black text-pacman-yellow border border-pacman-border group-hover:border-pacman-yellow group-hover:bg-pacman-yellow group-hover:text-black transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🔑</span>
                <span>CLAIM THIS ITEM</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReportFoundClick) onReportFoundClick(item);
                }}
                className="w-full py-1.5 font-pixel text-[0.45rem] bg-black text-pacman-inky border border-pacman-inky/60 group-hover:border-pacman-inky group-hover:bg-pacman-inky group-hover:text-black transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📢</span>
                <span>REPORT FOUND</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
