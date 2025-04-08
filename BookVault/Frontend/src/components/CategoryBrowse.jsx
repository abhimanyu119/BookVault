import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooksByCategory, formatBookData } from "../api/GoogleBooksAPI";
import BookCard from "./BookCard";

const CategoryBrowse = ({ category, title, description, limit = 6 }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setIsLoading(true);
        setError("");

        const { items } = await getBooksByCategory(category, {
          maxResults: limit,
        });

        if (items && items.length > 0) {
          const formattedBooks = items.map((book) => formatBookData(book));
          setBooks(formattedBooks);
        }
      } catch (error) {
        console.error(`Error fetching ${category} books:`, error);
        setError(`Failed to load ${category} books`);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchCategoryBooks();
    }
  }, [category, limit]);

  // If still loading initial data
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {title || category}
            </h2>
            {description && (
              <p className="text-indigo-300 mt-2">{description}</p>
            )}
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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // If no books found
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {title || category}
            </h2>
            {description && (
              <p className="text-indigo-300 mt-2">{description}</p>
            )}
          </div>
          <Link
            to={`/browse?category=${category}`}
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
          {books.map((book) => (
            <BookCard key={book.id} book={book} showDescription={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBrowse;
