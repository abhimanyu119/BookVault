import PropTypes from 'prop-types';

const SavedBooksList = ({ books, formatDate, onViewDetails, onRemove }) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden">
      <div className="p-6 border-b border-indigo-900/30">
        <h2 className="text-xl font-semibold text-white">Saved for Later</h2>
      </div>

      {books && books.length > 0 ? (
        <div className="divide-y divide-indigo-900/30">
          {books.map((book) => (
            <div
              key={book.id || book.googleBookId}
              className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              {/* Book cover - using Google Books thumbnail URL format */}
              <div className="w-16 h-24 flex-shrink-0 bg-indigo-900/40 rounded-md overflow-hidden">
                {book.volumeInfo?.imageLinks?.thumbnail || book.coverImage ? (
                  <img
                    src={
                      book.volumeInfo?.imageLinks?.thumbnail || book.coverImage
                    }
                    alt={`Cover of ${book.volumeInfo?.title || book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-indigo-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Book details - handling Google Books API response structure */}
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-white">
                  {book.volumeInfo?.title || book.title}
                </h3>
                <p className="text-indigo-300 text-sm">
                  {book.volumeInfo?.authors?.[0] ||
                    book.author ||
                    "Unknown author"}
                </p>

                {/* Additional details - using Google Books categories if available */}
                <p className="text-indigo-300/70 text-xs mt-1">
                  {book.volumeInfo?.categories?.[0] ||
                    book.category ||
                    "Uncategorized"}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div>
                    <span className="text-xs text-indigo-400">Added:</span>
                    <span className="ml-1 text-sm text-indigo-200">
                      {formatDate(
                        book.savedDate || book.borrowedDate || new Date()
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
                  onClick={() => onViewDetails(book.id || book.googleBookId)}
                >
                  View Details
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                  onClick={() => onRemove(book.id || book.googleBookId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center">
          <svg
            className="w-12 h-12 text-indigo-400/40 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-indigo-300">You don&#39;t have any saved books</p>
          <a
            href="/browse"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Browse the catalog
          </a>
        </div>
      )}

      {books && books.length > 0 && (
        <div className="p-4 text-center border-t border-indigo-900/30">
          <a
            href="/browse"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Discover more books
          </a>
        </div>
      )}
    </div>
  );
};

SavedBooksList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      googleBookId: PropTypes.string,
      volumeInfo: PropTypes.shape({
        title: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.string),
        categories: PropTypes.arrayOf(PropTypes.string),
        imageLinks: PropTypes.shape({
          thumbnail: PropTypes.string,
        }),
      }),
      title: PropTypes.string,
      author: PropTypes.string,
      category: PropTypes.string,
      coverImage: PropTypes.string,
      savedDate: PropTypes.string,
      borrowedDate: PropTypes.string,
    })
  ),
  formatDate: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default SavedBooksList;
