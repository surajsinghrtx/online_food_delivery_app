import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export type CategoryFilter = 'all' | 'signatures' | 'pizza' | 'burgers' | 'bowls' | 'pasta' | 'desserts';
export type DietaryFilter = 'all' | 'vegetarian' | 'vegan' | 'glutenFree' | 'chefsPick' | 'organic';
export type SortOption = 'recommended' | 'price_low' | 'price_high' | 'prep_time' | 'rating';

interface FilterBarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  activeDietary: DietaryFilter;
  onSelectDietary: (dietary: DietaryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  activeDietary,
  onSelectDietary,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResultsCount,
}) => {
  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'Complete Menu' },
    { id: 'signatures', label: 'Signatures' },
    { id: 'pizza', label: 'Wood-Fired Pizza' },
    { id: 'burgers', label: 'Artisan Burgers' },
    { id: 'bowls', label: 'Fresh Bowls' },
    { id: 'pasta', label: 'Handcrafted Pasta' },
    { id: 'desserts', label: 'Desserts & Drinks' },
  ];

  const dietaryTags: { id: DietaryFilter; label: string }[] = [
    { id: 'all', label: 'All Diets' },
    { id: 'chefsPick', label: "Chef's Selection" },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'glutenFree', label: 'Gluten-Conscious' },
    { id: 'organic', label: '100% Organic' },
    { id: 'vegan', label: 'Plant-Based' },
  ];

  return (
    <div id="menu" className="pt-10 pb-6 space-y-6">
      
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="menu-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ingredients, truffle, wagyu, burrata..."
            className="w-full pl-10 pr-9 py-2.5 bg-stone-900/90 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
          <div className="text-stone-400">
            <span className="font-mono tabular-nums text-stone-200 font-semibold">{totalResultsCount}</span> {totalResultsCount === 1 ? 'dish available' : 'dishes available'}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-stone-400 font-medium shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Sort:</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-stone-900 border border-stone-800 rounded-lg py-1.5 px-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="recommended">Featured / Curated</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="prep_time">Fastest Preparation</option>
            </select>
          </div>
        </div>

      </div>

      {/* Primary Category Segmented Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-stone-800/80">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Dietary Filter Bar (Interactive Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-500 shrink-0 font-medium">Dietary preference:</span>
        {dietaryTags.map((tag) => {
          const isActive = activeDietary === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectDietary(tag.id)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 font-medium'
                  : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
