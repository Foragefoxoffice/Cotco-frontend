const BlogCardSkeleton = () => (
  <div className="bg-gray-600 rounded-lg shadow-sm border border-gray-900 overflow-hidden animate-pulse flex flex-col">
    <div className="h-48 bg-gray-900"></div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="h-5 bg-gray-900 rounded mb-2 w-3/4"></div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-4 w-20 bg-gray-900 rounded"></div>
        <div className="h-4 w-16 bg-gray-900 rounded"></div>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <div className="h-6 w-24 bg-gray-900 rounded"></div>
        <div className="flex space-x-2">
          <div className="h-6 w-6 bg-gray-900 rounded"></div>
          <div className="h-6 w-6 bg-gray-900 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);
export default BlogCardSkeleton;
