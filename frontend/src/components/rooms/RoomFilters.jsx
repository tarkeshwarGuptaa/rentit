import { useState } from 'react';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';

const ROOM_TYPES = ['single', 'shared', '1BHK', '2BHK'];
const AMENITIES = ['WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'];
const AREAS = ['Ber Sarai', 'Katwaria Sarai', 'Munirka', 'Hauz Khas', 'Safdarjung'];

const RoomFilters = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search });
  };

  const handleClearFilters = () => {
    setSearch('');
    onFilterChange({
      search: '',
      area: '',
      roomType: '',
      minPrice: '',
      maxPrice: '',
      amenities: '',
    });
  };

  const hasActiveFilters =
    filters.area || filters.roomType || filters.minPrice || filters.maxPrice || filters.amenities || filters.search;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/40" />
          <input
            type="text"
            placeholder="Search rooms, areas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-input)] text-sm font-medium border transition-colors cursor-pointer ${
            showFilters
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-surface-200 text-surface-700 hover:bg-surface-50'
          }`}
        >
          <FiSliders className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </button>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-surface-200 rounded-[var(--radius-card)] p-5 animate-fade-in space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-surface-900 text-sm">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
              >
                <FiX className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Area */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">Area</label>
              <select
                value={filters.area || ''}
                onChange={(e) => onFilterChange({ area: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
              >
                <option value="">All Areas</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">Room Type</label>
              <select
                value={filters.roomType || ''}
                onChange={(e) => onFilterChange({ roomType: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
              >
                <option value="">All Types</option>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'single' ? 'Single Room' : t === 'shared' ? 'Shared Room' : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">Min Price (₹)</label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">Max Price (₹)</label>
              <input
                type="number"
                placeholder="₹50,000"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => {
                const selected = filters.amenities?.split(',').includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => {
                      const current = filters.amenities ? filters.amenities.split(',') : [];
                      const updated = selected
                        ? current.filter((a) => a !== amenity)
                        : [...current, amenity];
                      onFilterChange({ amenities: updated.join(',') });
                    }}
                    className={`px-3 py-1.5 rounded-[var(--radius-badge)] text-xs font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomFilters;
