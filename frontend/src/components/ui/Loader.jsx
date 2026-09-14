// Skeleton shimmer — pure Tailwind animate-pulse + bg-zinc-200
const sk = "animate-pulse bg-zinc-200";

const RoomCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div className={`${sk} h-48 w-full`} />
    <div className="p-4 space-y-3">
      <div className={`${sk} h-5 w-3/4 rounded`} />
      <div className={`${sk} h-4 w-1/2 rounded`} />
      <div className="flex gap-2">
        <div className={`${sk} h-6 w-16 rounded-full`} />
        <div className={`${sk} h-6 w-16 rounded-full`} />
        <div className={`${sk} h-6 w-16 rounded-full`} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className={`${sk} h-6 w-24 rounded`} />
        <div className={`${sk} h-4 w-16 rounded`} />
      </div>
    </div>
  </div>
);

const Loader = ({ count = 6, type = 'grid' }) => {
  if (type === 'detail') {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-8 animate-fade-in">
        <div className={`${sk} h-8 w-2/3 mb-4 rounded`} />
        <div className="grid grid-cols-2 gap-2 mb-8">
          <div className={`${sk} h-72 rounded-2xl`} />
          <div className="grid grid-cols-2 gap-2">
            <div className={`${sk} h-[8.5rem] rounded-2xl`} />
            <div className={`${sk} h-[8.5rem] rounded-2xl`} />
            <div className={`${sk} h-[8.5rem] rounded-2xl`} />
            <div className={`${sk} h-[8.5rem] rounded-2xl`} />
          </div>
        </div>
        <div className="space-y-3">
          <div className={`${sk} h-5 w-full rounded`} />
          <div className={`${sk} h-5 w-5/6 rounded`} />
          <div className={`${sk} h-5 w-4/6 rounded`} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Loader;
