import React, { useState, useEffect, useMemo } from 'react';
import { items as initialItems, LOCATION_PRIORITY } from './data/items';
import { useDebounce } from './hooks/useDebounce';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ItemGrid from './components/ItemGrid';
import PostItemForm from './components/PostItemForm';
import RetroCursor from './components/RetroCursor';

const INITIAL_FILTERS = { category: '', location: '', status: '' };

function sortItems(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'nearest':
      return sorted.sort(
        (a, b) =>
          (LOCATION_PRIORITY[a.location] ?? 99) -
          (LOCATION_PRIORITY[b.location] ?? 99)
      );
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default function App() {
  const [items, setItems]         = useState(initialItems);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters]     = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy]       = useState('newest');

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    if (filters.category) result = result.filter((i) => i.category === filters.category);
    if (filters.location)  result = result.filter((i) => i.location  === filters.location);
    if (filters.status)    result = result.filter((i) => i.status    === filters.status);
    return sortItems(result, sortBy);
  }, [items, debouncedSearch, filters, sortBy]);

  const activeFilterCount = useMemo(
    () => [filters.category, filters.location, filters.status].filter(Boolean).length,
    [filters]
  );

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleClearFilters() {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
    setSortBy('newest');
  }

  function handleAddItem(newItem) {
    setItems((prev) => [newItem, ...prev]);
  }

  const lostCount    = items.filter((i) => i.status === 'Lost').length;
  const foundCount   = items.filter((i) => i.status === 'Found').length;
  const claimedCount = items.filter((i) => i.status === 'Claimed').length;

  return (
    <div className="min-h-screen bg-black">
      {/* Retro Pixel Hand Pointer with Orange Dots Trail */}
      <RetroCursor />
      <Navbar onReportItem={() => setShowForm(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero */}
        <div className="mb-8">
          {/* Marquee-style subtitle */}
          <p className="font-pixel text-pacman-border text-[0.4rem] tracking-widest mb-3 animate-flicker">
            ★ ★ ★ &nbsp; CAMPUS ARCADE LOST &amp; FOUND &nbsp; ★ ★ ★
          </p>

          <h1 className="font-pixel text-pacman-yellow text-[1rem] sm:text-[1.3rem] leading-loose mb-3 glow-yellow">
            PAC BOARD
          </h1>

          <p className="font-vt text-pacman-yellow/60 text-xl sm:text-2xl max-w-xl">
            Browse all reported lost and found items on campus.
            Use search and filters to hunt down your item!
          </p>

          {/* Ghost stats bar */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: 'LOST',    count: lostCount,    color: 'border-pacman-blinky/50 bg-pacman-blinky/10 text-pacman-blinky', icon: '🔴' },
              { label: 'FOUND',   count: foundCount,   color: 'border-pacman-inky/50  bg-pacman-inky/10  text-pacman-inky',   icon: '🔵' },
              { label: 'CLAIMED', count: claimedCount, color: 'border-pacman-pinky/50 bg-pacman-pinky/10 text-pacman-pinky',  icon: '🟣' },
              { label: 'TOTAL',   count: items.length, color: 'border-pacman-yellow/50 bg-pacman-yellow/10 text-pacman-yellow', icon: '🟡' },
            ].map(({ label, count, color, icon }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-3 py-2 border-2 font-pixel text-[0.4rem] tracking-wide ${color}`}
              >
                <span className="text-base">{icon}</span>
                <span className="text-lg font-bold">{count}</span>
                <span className="opacity-70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterPanel
            filters={filters}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={setSortBy}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Result count */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-4">
            <p className="font-vt text-pacman-yellow/60 text-lg">
              SHOWING{' '}
              <span className="text-pacman-yellow font-bold">{filteredItems.length}</span>
              {' '}OF{' '}
              <span className="text-pacman-yellow font-bold">{items.length}</span>
              {' '}ITEMS
              {debouncedSearch && (
                <span className="text-pacman-yellow/40">
                  {' '}FOR &ldquo;<span className="text-pacman-inky">{debouncedSearch}</span>&rdquo;
                </span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <span className="font-pixel text-[0.4rem] text-pacman-yellow border-2 border-pacman-yellow/40 bg-pacman-yellow/10 px-2 py-1">
                {activeFilterCount} FILTER{activeFilterCount !== 1 ? 'S' : ''} ON
              </span>
            )}
          </div>
        )}

        {/* Item grid */}
        <ItemGrid
          items={filteredItems}
          isLoading={isLoading}
          onClearFilters={handleClearFilters}
        />

        {/* Footer dots */}
        <div className="flex items-center justify-center gap-2 mt-16 mb-4" aria-hidden>
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-pacman-yellow/30 inline-block animate-dot-pulse"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        <p className="font-pixel text-pacman-border text-[0.35rem] text-center tracking-widest mb-8">
          © INSERT COIN TO CONTINUE · CAMPUS MFC ARCADE
        </p>
      </main>

      {/* Modal */}
      {showForm && (
        <PostItemForm
          onAdd={handleAddItem}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
