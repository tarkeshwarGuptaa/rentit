const RoomCardSkeleton = () => (
  <div className="bg-white rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]">
    <div className="skeleton h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  </div>
);

const Loader = ({ count = 6, type = 'grid' }) => {
  if (type === 'detail') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="skeleton h-8 w-2/3 mb-4" />
        <div className="grid grid-cols-2 gap-2 mb-8">
          <div className="skeleton h-72 rounded-[var(--radius-card)]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="skeleton h-[8.5rem] rounded-[var(--radius-card)]" />
            <div className="skeleton h-[8.5rem] rounded-[var(--radius-card)]" />
            <div className="skeleton h-[8.5rem] rounded-[var(--radius-card)]" />
            <div className="skeleton h-[8.5rem] rounded-[var(--radius-card)]" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-5/6" />
          <div className="skeleton h-5 w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Loader;
