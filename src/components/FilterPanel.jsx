import React from 'react';
import { CATEGORIES, LOCATIONS, STATUSES } from '../data/items';

const SORT_OPTIONS = [
  { value: 'newest', label: 'NEWEST FIRST' },
  { value: 'oldest', label: 'OLDEST FIRST' },
  { value: 'nearest', label: 'NEAREST LOC'  },
];

/**
 * A single retro-styled select.
 */
function FilterSelect({ label, value, onChange, options, allLabel }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="font-pixel text-pacman-yellow/60 text-[0.4rem] tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full appearance-none bg-pacman-card border-2 border-pacman-border
            text-pacman-yellow font-vt text-lg
            px-3 py-2 pr-8
            focus:outline-none focus:border-pacman-yellow
            transition-colors cursor-pointer
          "
        >
          <option value="">{allLabel}</option>
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        {/* Pixel chevron */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <span className="text-pacman-yellow font-pixel text-[0.5rem]">▼</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Filter panel with ghost-themed labels.
 */
export default function FilterPanel({ filters, sortBy, onFilterChange, onSortChange, activeCount }) {
  const hasActiveFilters = activeCount > 0;

  return (
    <div className="bg-pacman-card border-2 border-pacman-border p-4">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-pixel text-pacman-yellow text-[0.45rem] tracking-widest">
          👻 FILTERS
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => {
              onFilterChange('category', '');
              onFilterChange('location', '');
              onFilterChange('status', '');
              onSortChange('newest');
            }}
            className="font-pixel text-[0.4rem] text-pacman-blinky border border-pacman-blinky/50 px-2 py-1 hover:bg-pacman-blinky/20 transition-colors"
          >
            ✕ CLEAR ({activeCount})
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-32">
          <FilterSelect
            label="CATEGORY"
            value={filters.category}
            onChange={(v) => onFilterChange('category', v)}
            options={CATEGORIES}
            allLabel="ALL TYPES"
          />
        </div>
        <div className="flex-1 min-w-32">
          <FilterSelect
            label="LOCATION"
            value={filters.location}
            onChange={(v) => onFilterChange('location', v)}
            options={LOCATIONS}
            allLabel="ALL ZONES"
          />
        </div>
        <div className="flex-1 min-w-28">
          <FilterSelect
            label="STATUS"
            value={filters.status}
            onChange={(v) => onFilterChange('status', v)}
            options={STATUSES}
            allLabel="ALL GHOSTS"
          />
        </div>
        <div className="flex-1 min-w-32">
          <FilterSelect
            label="SORT BY"
            value={sortBy}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            allLabel="DEFAULT"
          />
        </div>
      </div>
    </div>
  );
}
