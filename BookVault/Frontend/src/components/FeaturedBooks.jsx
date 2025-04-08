import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNewReleases, formatBookData } from "../api/GoogleBooksAPI";
import BookCard from "./BookCard";

const FeaturedBooks = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch new releases or featured books
        const { items } = await getNewReleases({ maxResults: 6 });

        if (items && items.length > 0) {
          const formattedBooks = items.map((book) => formatBookData(book));
          setFeaturedBooks(formattedBooks);
        }
      } catch (error) {
        console.error("Error fetching featured books:", error);
        setError("Failed to load featured books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // If still loading initial data
  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">New Releases</h2>
            <p className="text-indigo-300 mt-2">
              Loading the latest additions to our library...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="py-12 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // If no featured books found
  if (featuredBooks.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">New Releases</h2>
            <p className="text-indigo-300 mt-2">
              The latest additions to our library
            </p>
          </div>
          <Link
            to="/browse?sort=newest"
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
          >
            View All
            <svg
              className="ml-1 w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} showDescription={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBooks;
