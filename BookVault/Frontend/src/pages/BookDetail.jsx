import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SaveButton from "../components/SaveButton";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        setBook(response.data);

        // Check if this book is saved
        checkIfBookIsSaved(response.data.id);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // Check if book is saved in localStorage
  const checkIfBookIsSaved = (bookId) => {
    const savedBooks = localStorage.getItem("savedBooks");
    if (!savedBooks) {
      setIsSaved(false);
      return;
    }

    const parsedBooks = JSON.parse(savedBooks);
    const found = parsedBooks.some(
      (savedBook) =>
        savedBook.id === bookId || savedBook.googleBookId === bookId
    );

    setIsSaved(found);
  };

  // Save or remove book from saved collection
  const toggleSaveBook = () => {
    if (!book) return;

    const savedBooksData = localStorage.getItem("savedBooks");
    const currentSavedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

    // Format book data for saving
    const formattedBook = {
      id: book.id,
      googleBookId: book.id,
      savedDate: new Date().toISOString(),
      status: "saved", // Default status
      volumeInfo: book.volumeInfo || {},
    };

    if (isSaved) {
      // Remove book from saved books
      const updatedSavedBooks = currentSavedBooks.filter(
        (savedBook) =>
          savedBook.id !== book.id && savedBook.googleBookId !== book.id
      );
      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
      setIsSaved(false);
    } else {
      // Add book to saved books
      const updatedSavedBooks = [...currentSavedBooks, formattedBook];
      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
      setIsSaved(true);
    }
  };

  // Format authors list
  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return "Unknown Author";
    return authors.join(", ");
  };

  // Generate a color based on the book title for placeholder background
  const generateColorFromTitle = (title) => {
    const str = title || "Unknown";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsla(${hue}, 70%, 15%, 1)`;
  };

  // Get first letter of the title for placeholder
  const getTitleInitial = (title) => {
    return (title || "U")[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-indigo-300">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg max-w-2xl text-center mb-6">
          {error}
        </div>
        <Link to="/browse" className="text-indigo-400 hover:text-indigo-300">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-lg max-w-2xl text-center mb-6">
          Book not found
        </div>
        <Link to="/browse" className="text-indigo-400 hover:text-indigo-300">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const volumeInfo = book.volumeInfo || {};
  const shouldShowPlaceholder = !volumeInfo.imageLinks || imageError;

  // Create a book object compatible with the SaveButton component
  const bookForSaveButton = {
    id: book.id,
    title: volumeInfo.title,
    authors: volumeInfo.authors,
    description: volumeInfo.description,
    categories: volumeInfo.categories,
    imageLinks: volumeInfo.imageLinks,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 py-16 px-4 relative">
      {/* Background elements - with position fixed within viewport */}
      <div className="fixed top-1/4 left-0 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12 -z-10"></div>
      <div className="fixed bottom-1/4 right-[5%] w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12 -z-10"></div>

      <div className="max-w-6xl mt-8 mx-auto">
        {/* Back navigation */}
        <Link
          to="/browse"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-6 group"
        >
          <svg
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Browse
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 shadow-xl">
          {/* Book header section - title, author, rating */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {volumeInfo.title}
            </h1>

            {volumeInfo.subtitle && (
              <h2 className="text-xl text-indigo-300 mb-4">
                {volumeInfo.subtitle}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-indigo-200 text-lg">
                by {formatAuthors(volumeInfo.authors)}
              </p>

              {volumeInfo.averageRating && (
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(volumeInfo.averageRating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-indigo-300">
                    {volumeInfo.averageRating.toFixed(1)}
                    {volumeInfo.ratingsCount &&
                      ` (${volumeInfo.ratingsCount} ratings)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Book cover and action buttons */}
            <div>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md mb-6 flex items-center justify-center p-4">
                {!shouldShowPlaceholder ? (
                  <img
                    src={
                      volumeInfo.imageLinks.thumbnail?.replace(
                        "http:",
                        "https:"
                      ) ||
                      volumeInfo.imageLinks.smallThumbnail?.replace(
                        "http:",
                        "https:"
                      )
                    }
                    alt={`Cover of ${volumeInfo.title}`}
                    className="max-w-[180px] max-h-[250px] object-contain"
                    style={{ filter: "contrast(1.05) saturate(1.2)" }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="aspect-[2/3] w-[180px] h-[250px] relative flex items-center justify-center"
                    style={{
                      backgroundColor: generateColorFromTitle(volumeInfo.title),
                    }}
                  >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-5xl font-bold text-white/60 mb-2">
                        {getTitleInitial(volumeInfo.title)}
                      </span>
                      <h3 className="text-lg font-semibold text-white/90 line-clamp-3">
                        {volumeInfo.title}
                      </h3>
                      <p className="text-white/70 mt-2 text-sm">
                        {formatAuthors(volumeInfo.authors)}
                      </p>
                    </div>
                    {/* Decorative elements for the placeholder */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-white/5"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-white/5"></div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3 mb-6">
                {/* Save button */}
                <SaveButton book={bookForSaveButton} />

                {volumeInfo.previewLink && (
                  <a
                    href={volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Preview on Google Books
                  </a>
                )}

                {volumeInfo.infoLink && (
                  <a
                    href={volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    More Information
                  </a>
                )}

                {book.saleInfo?.buyLink && (
                  <a
                    href={book.saleInfo.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 text-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Purchase
                  </a>
                )}
              </div>

              {/* Book metadata - left side */}
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Book Details
                </h3>
                <div className="space-y-3">
                  {volumeInfo.publishedDate && (
                    <div className="text-indigo-300">
                      <span className="text-indigo-400">Published: </span>
                      {volumeInfo.publishedDate}
                    </div>
                  )}

                  {volumeInfo.publisher && (
                    <div className="text-indigo-300">
                      <span className="text-indigo-400">Publisher: </span>
                      {volumeInfo.publisher}
                    </div>
                  )}

                  {volumeInfo.pageCount > 0 && (
                    <div className="text-indigo-300">
                      <span className="text-indigo-400">Pages: </span>
                      {volumeInfo.pageCount}
                    </div>
                  )}

                  {volumeInfo.language && (
                    <div className="text-indigo-300">
                      <span className="text-indigo-400">Language: </span>
                      {volumeInfo.language.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right columns (spans 2 columns): Description and other details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/30">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Description
                </h3>
                {volumeInfo.description ? (
                  <div
                    className="text-indigo-200 prose prose-invert prose-indigo max-w-none overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: volumeInfo.description }}
                  />
                ) : (
                  <p className="text-indigo-400 italic">
                    No description available for this book.
                  </p>
                )}
              </div>

              {/* Additional information - 2 column grid for smaller details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                {/* Categories */}
                {volumeInfo.categories && volumeInfo.categories.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {volumeInfo.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-indigo-800/60 text-xs px-2 py-1 rounded-full text-indigo-200 inline-block break-words"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {book.saleInfo && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Availability
                    </h3>
                    <div className="space-y-2">
                      <p className="text-indigo-300">
                        <span className="text-indigo-400">Status: </span>
                        {book.saleInfo.saleability}
                      </p>
                      {book.saleInfo.listPrice && (
                        <p className="text-indigo-300">
                          <span className="text-indigo-400">Price: </span>
                          {book.saleInfo.listPrice.amount}{" "}
                          {book.saleInfo.listPrice.currencyCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ISBN and other identifiers */}
                {volumeInfo.industryIdentifiers &&
                  volumeInfo.industryIdentifiers.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        ISBN & Identifiers
                      </h3>
                      <div className="space-y-2">
                        {volumeInfo.industryIdentifiers.map(
                          (identifier, index) => (
                            <p
                              key={index}
                              className="text-indigo-300 break-words"
                            >
                              <span className="text-indigo-400">
                                {identifier.type.replace("_", " ")}:{" "}
                              </span>
                              {identifier.identifier}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Additional book information - if we have specific details to show */}
                {(volumeInfo.maturityRating ||
                  volumeInfo.printType ||
                  volumeInfo.contentVersion) && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Additional Information
                    </h3>
                    <div className="space-y-2">
                      {volumeInfo.printType && (
                        <p className="text-indigo-300">
                          <span className="text-indigo-400">Type: </span>
                          {volumeInfo.printType}
                        </p>
                      )}

                      {volumeInfo.maturityRating && (
                        <p className="text-indigo-300">
                          <span className="text-indigo-400">
                            Maturity Rating:{" "}
                          </span>
                          {volumeInfo.maturityRating}
                        </p>
                      )}

                      {volumeInfo.contentVersion && (
                        <p className="text-indigo-300">
                          <span className="text-indigo-400">
                            Content Version:{" "}
                          </span>
                          {volumeInfo.contentVersion}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
