const BlogOverviewSkeleton = () => (
  <div className="max-w-6xl mx-auto py-10 mt-10 px-4 animate-pulse">
    {/* Category */}
    <div className="flex justify-center mb-6">
      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
    </div>

    {/* Title */}
    <div className="h-10 w-3/4 mx-auto bg-gray-200 rounded mb-6"></div>

    {/* Excerpt */}
    <div className="h-4 w-2/3 mx-auto bg-gray-200 rounded mb-10"></div>

    {/* Cover Image */}
    <div className="w-full h-96 bg-gray-200 rounded-xl mb-10"></div>

    {/* Content blocks */}
    <div className="space-y-6">
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
    </div>

    {/* Recommended Section */}
    <div className="mt-20">
      <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-12"></div>
      <div className="grid gap-20 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          >
            <div className="h-48 w-full bg-gray-200"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default BlogOverviewSkeleton;
