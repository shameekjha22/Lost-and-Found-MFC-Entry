# 🎒 Campus Lost & Found Board

A modern, responsive web application for managing lost and found items on a college campus. Built with React + Vite + Tailwind CSS.

---

## ✨ Features

- 🔍 **Debounced Search** – 300ms debounce across name, description, category, and location
- 🗂️ **Filter Panel** – Filter by Category, Location, and Status
- ↕️ **Sort Options** – Newest, Oldest, and Nearest (by location priority)
- 🖼️ **Image Preview** – Upload image before submission with live preview
- 💀 **Skeleton Loading** – Animated skeleton cards on initial load (1.5s simulation)
- 📭 **Empty State** – Friendly empty state when no items match filters
- ✅ **Form Validation** – Inline error messages, min-length checks, no future dates
- 📱 **Responsive Design** – Mobile (1-col), Tablet (2-col), Desktop (3-col)
- 🌙 **Dark Theme** – Gray-900 base with orange (#f97316) accents
- 🏷️ **Status Badges** – Lost (red), Found (green), Claimed (gray)

---

## 📁 Component Structure

| Component | File | Purpose |
|---|---|---|
| `App` | `src/App.jsx` | Root component, state management, filtering & sorting |
| `Navbar` | `src/components/Navbar.jsx` | Top navigation bar with branding and Report button |
| `SearchBar` | `src/components/SearchBar.jsx` | Debounced search input with clear button |
| `FilterPanel` | `src/components/FilterPanel.jsx` | Category / Location / Status / Sort dropdowns |
| `ItemGrid` | `src/components/ItemGrid.jsx` | Responsive grid, handles loading and empty states |
| `ItemCard` | `src/components/ItemCard.jsx` | Individual item card with image, badges, meta |
| `SkeletonCard` | `src/components/SkeletonCard.jsx` | Animated pulse skeleton matching ItemCard layout |
| `EmptyState` | `src/components/EmptyState.jsx` | Empty state with icon, text, and clear-filters CTA |
| `PostItemForm` | `src/components/PostItemForm.jsx` | Modal form with validation and image preview |
| `useDebounce` | `src/hooks/useDebounce.js` | Custom hook for debouncing a value |
| `items` | `src/data/items.js` | 15 mock items + category/location/status constants |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Tech | Version | Role |
|---|---|---|
| React | ^18.3 | UI framework |
| Vite | ^6.0 | Build tool & dev server |
| Tailwind CSS | ^3.4 | Utility-first CSS framework |
| PostCSS + Autoprefixer | ^8 / ^10 | CSS processing pipeline |
| @vitejs/plugin-react | ^4.3 | React JSX transform plugin |

---

## 📦 Data Model

```js
{
  id: number,
  name: string,           // Item name (min 3 chars)
  category: string,       // 'Accessories' | 'Electronics' | 'Books' | 'Clothing' | 'Keys' | 'Other'
  location: string,       // 'Library' | 'Cafeteria' | 'Gym' | 'Parking Lot' | 'Lecture Hall A' | 'Lecture Hall B' | 'Hostel Block'
  date: string,           // YYYY-MM-DD, not future
  status: string,         // 'Lost' | 'Found' | 'Claimed'
  image: string | null,   // Data URL or null (uses picsum placeholder)
  description: string,    // Optional details
}
```

---

## 📸 Screenshots

> Launch the app and visit `http://localhost:5173` to see the full UI.

---

*Built for MFC Campus — Lost & Found Board Project*
