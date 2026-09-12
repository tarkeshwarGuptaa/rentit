import { FiArrowDown, FiArrowUp, FiClock } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: FiClock },
  { value: 'price_asc', label: 'Price: Low → High', icon: FiArrowUp },
  { value: 'price_desc', label: 'Price: High → Low', icon: FiArrowDown },
];

const RoomSort = ({ currentSort, onSortChange, totalRooms }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-surface-700/60">
        <span className="font-semibold text-surface-900">{totalRooms}</span> rooms found
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-700/50 hidden sm:inline">Sort by:</span>
        <div className="flex bg-surface-100 rounded-[var(--radius-input)] p-0.5">
          {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => onSortChange(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                currentSort === value
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-surface-700/60 hover:text-surface-700'
              }`}
              title={label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSort;
