import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SaveButton = ({ book }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState("saved");
  
  // Check if book is already saved when component mounts
  useEffect(() => {
    const checkSavedStatus = () => {
      const savedBooks = localStorage.getItem("savedBooks");
      if (!savedBooks) return;

      const parsedBooks = JSON.parse(savedBooks);
      const bookId = book.id;

      const savedBook = parsedBooks.find(
        (item) => item.id === bookId || item.googleBookId === bookId
      );

      if (savedBook) {
        setIsSaved(true);
        setStatus(savedBook.status || "saved");
      }
    };

    checkSavedStatus();
  }, [book.id]);

  const toggleSave = () => {
    // Get existing saved books
    const savedBooksData = localStorage.getItem("savedBooks");
    const currentSavedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

    if (isSaved) {
      // If already saved, remove it
      const updatedSavedBooks = currentSavedBooks.filter(
        (savedBook) =>
          savedBook.id !== book.id && savedBook.googleBookId !== book.id
      );

      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
      setIsSaved(false);
    } else {
      // If not saved, add it
      const bookToSave = {
        id: book.id,
        googleBookId: book.id,
        savedDate: new Date().toISOString(),
        status: "saved", // Default status
        volumeInfo: {
          title: book.title,
          authors: book.authors,
          categories: book.categories,
          imageLinks: book.imageLinks,
          description: book.description,
        },
      };

      const updatedSavedBooks = [...currentSavedBooks, bookToSave];
      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
      setIsSaved(true);
    }
  };

  const updateStatus = (newStatus) => {
    // Get existing saved books
    const savedBooksData = localStorage.getItem("savedBooks");
    const currentSavedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

    // Find if the book exists
    const existingBookIndex = currentSavedBooks.findIndex(
      (savedBook) =>
        savedBook.id === book.id || savedBook.googleBookId === book.id
    );

    if (existingBookIndex >= 0) {
      // Update status of existing book
      currentSavedBooks[existingBookIndex].status = newStatus;
      localStorage.setItem("savedBooks", JSON.stringify(currentSavedBooks));
      setStatus(newStatus);
    } else {
      // If not already saved, save with the status
      const bookToSave = {
        id: book.id,
        googleBookId: book.id,
        savedDate: new Date().toISOString(),
        status: newStatus,
        volumeInfo: {
          title: book.title,
          authors: book.authors,
          categories: book.categories,
          imageLinks: book.imageLinks,
          description: book.description,
        },
      };

      const updatedSavedBooks = [...currentSavedBooks, bookToSave];
      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
      setIsSaved(true);
      setStatus(newStatus);
    }
  };

  // If already saved, show status options dropdown, otherwise just show save button
  if (isSaved) {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm font-medium cursor-pointer"
          >
            <option value="saved">Saved</option>
            <option value="reading">Currently Reading</option>
            <option value="finished">Finished Reading</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <button
          onClick={toggleSave}
          className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleSave}
      className="flex items-center justify-center w-full py-2.5 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      Save for Later
    </button>
  );
};

SaveButton.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    imageLinks: PropTypes.object,
  }).isRequired,
};

export default SaveButton;
