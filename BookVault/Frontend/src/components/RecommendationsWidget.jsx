const RecommendationsWidget = () => {
  return (
    <div className="mt-6 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden">
      <div className="p-6 border-b border-indigo-900/30">
        <h2 className="text-xl font-semibold text-white">
          Similar Books You Might Like
        </h2>
      </div>
      <div className="p-6">
        <p className="text-indigo-300 mb-4">
          Based on your reading interests, explore more books from the same
          genres and authors.
        </p>
        <a
          href="/browse?recommendation=true"
          className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
        >
          See Recommendations
        </a>
      </div>
    </div>
  );
};

export default RecommendationsWidget;
