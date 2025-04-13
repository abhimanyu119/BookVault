import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Define default book object
const DEFAULT_BOOK = {
  title: "Unknown Title",
  authors: ["Unknown Author"],
  description: "No description available",
  imageLinks: null,
  averageRating: 0,
};

const BookCard = ({ book = DEFAULT_BOOK }) => {
  const [imageError, setImageError] = useState(false);

  // Truncate long text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Format author list
  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return "Unknown Author";
    if (authors.length === 1) return authors[0];
    return `${authors[0]} et al.`;
  };

  // Try to get the best available image URL
  const getImageUrl = () => {
    if (!book.imageLinks) return null;

    // Try to extract better quality images if available
    // Note: These are not always available in the API response
    const imageOptions = [
      book.imageLinks.large,
      book.imageLinks.medium,
      book.imageLinks.small,
      book.imageLinks.thumbnail,
      book.imageLinks.smallThumbnail,
    ];

    // Return the first non-null image URL
    const bestImage = imageOptions.find((url) => url);

    // Make sure the URL uses HTTPS
    return bestImage ? bestImage.replace("http:", "https:") : null;
  };

  // Generate a color based on the book title for placeholder background
  const generateColorFromTitle = () => {
    const str = book.title || "Unknown";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsla(${hue}, 70%, 15%, 1)`;
  };

  // Get first letter of the title for placeholder
  const getTitleInitial = () => {
    return (book.title || "U")[0].toUpperCase();
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden hover:border-indigo-700/30 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-indigo-900/30 group">
      {/* Book cover with enhanced styling */}
      <div className="relative pt-[140%] overflow-hidden">
        {imageUrl && !imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <img
              src={imageUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              style={{
                filter: "contrast(1.05) saturate(1.2)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40"></div>
          </div>
        ) : (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{ backgroundColor: generateColorFromTitle() }}
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <span className="text-5xl font-bold text-white/60 mb-2">
                {getTitleInitial()}
              </span>
              <h3 className="text-xl font-semibold text-white/90 line-clamp-3">
                {book.title}
              </h3>
              <p className="text-white/70 mt-2">
                {formatAuthors(book.authors)}
              </p>
            </div>
            {/* Decorative elements for the placeholder */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/5"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-full bg-white/5"></div>
          </div>
        )}

        {/* Rating badge with enhanced styling */}
        {book.averageRating > 0 && (
          <div className="absolute top-2 right-2 bg-indigo-900/90 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
            <svg
              className="w-3.5 h-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{book.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Book details with improved layout and styling */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-white font-semibold line-clamp-2 mb-1 group-hover:text-indigo-300 transition-colors">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="text-indigo-300 text-sm mb-2 line-clamp-2">
            {book.subtitle}
          </p>
        )}
        <p className="text-indigo-400 text-sm mb-3">
          {formatAuthors(book.authors)}
        </p>

        {/* Book description with better formatting */}
        <p className="text-indigo-200 text-sm mb-4 line-clamp-3 leading-relaxed">
          {book.description
            ? truncateText(book.description, 150)
            : "No description available"}
        </p>

        {/* Action buttons with improved styling */}
        <div className="mt-auto space-y-2">
          <Link
            to={`/books/${book.id}`}
            className="block w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-600/20"
          >
            View Details
          </Link>
          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Preview
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Define prop types for component validation
BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    imageLinks: PropTypes.shape({
      smallThumbnail: PropTypes.string,
      thumbnail: PropTypes.string,
      small: PropTypes.string,
      medium: PropTypes.string,
      large: PropTypes.string,
      extraLarge: PropTypes.string,
    }),
    averageRating: PropTypes.number,
    previewLink: PropTypes.string,
  }).isRequired,
};

export default BookCard;
