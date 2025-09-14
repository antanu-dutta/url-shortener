const SkeletonLoader = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
