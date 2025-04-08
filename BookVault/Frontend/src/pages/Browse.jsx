import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Browse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // State for books and UI
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // State for advanced options
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Refs for infinite scrolling
  const observer = useRef();
  const lastBookElementRef = useRef();

  // Categories for filter dropdown
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "nonfiction", label: "Non-Fiction" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "history", label: "History" },
    { value: "biography", label: "Biography" },
    { value: "business", label: "Business" },
    { value: "poetry", label: "Poetry" },
    { value: "philosophy", label: "Philosophy" },
    { value: "art", label: "Art" },
    { value: "cooking", label: "Cooking" },
    { value: "health", label: "Health & Fitness" },
  ];

  // Listen for URL changes and update state accordingly
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("q");
    const categoryParam = searchParams.get("category");

    if (queryParam) setSearchTerm(queryParam);
    if (categoryParam) setCategory(categoryParam);

    // Reset page when search params change
    if (queryParam !== searchTerm || categoryParam !== category) {
      setPage(0);
      setBooks([]);
    }
  }, [location.search]);

  // Fetch books from Google Books API
  const fetchBooks = async (reset = false) => {
    try {
      setIsLoading(true);
      setError("");

      // Use reset to determine whether to append or replace results
      const currentPage = reset ? 0 : page;
      const startIndex = currentPage * 10; // Google Books API uses multiples of 10

      // Construct the query
      let query = searchTerm;

      if (category && category !== "all") {
        query += `+subject:${category}`;
      }

      // Filter options
      let filterQuery = "";
      if (filterBy !== "all") {
        filterQuery = `&filter=${filterBy}`;
      }

      // Call Google Books API
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=10&orderBy=${sortBy}${filterQuery}&key=${
          process.env.REACT_APP_GOOGLE_BOOKS_API_KEY || "YOUR_API_KEY"
        }`
      );

      const { items, totalItems } = response.data;

      // Check if we have results and if there are more to load
      if (!items || items.length === 0) {
        setHasMore(false);
        if (currentPage === 0) {
          setBooks([]);
          if (searchTerm) {
            setError("No books found for your search. Try different keywords.");
          }
        }
        return;
      }

      // Process and set books
      const newBooks = items.map((book) => ({
        id: book.id,
        title: book.volumeInfo.title || "Unknown Title",
        subtitle: book.volumeInfo.subtitle || "",
        authors: book.volumeInfo.authors || ["Unknown Author"],
        publisher: book.volumeInfo.publisher || "Unknown Publisher",
        publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
        description: book.volumeInfo.description || "No description available",
        pageCount: book.volumeInfo.pageCount || 0,
        categories: book.volumeInfo.categories || [],
        averageRating: book.volumeInfo.averageRating || 0,
        ratingsCount: book.volumeInfo.ratingsCount || 0,
        imageLinks: book.volumeInfo.imageLinks || {
          thumbnail: null,
          smallThumbnail: null,
        },
        language: book.volumeInfo.language || "en",
        previewLink: book.volumeInfo.previewLink || "",
        infoLink: book.volumeInfo.infoLink || "",
        canonicalVolumeLink: book.volumeInfo.canonicalVolumeLink || "",
      }));

      if (reset) {
        setBooks(newBooks);
        setPage(1); // Next page will be 1
      } else {
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setPage((prevPage) => prevPage + 1);
      }

      // Determine if there are more results
      setHasMore(startIndex + items.length < totalItems);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(
        error.response?.data?.error?.message ||
          "Failed to load books. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    // Only fetch if we have a search term or if we're showing recommendations
    if (searchTerm || searchParams.get("recommendations") === "true") {
      fetchBooks(true);
    }
  }, [searchTerm, category, sortBy, filterBy]);

  // Update URL when search parameters change
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (category !== "all") params.set("category", category);

    navigate(
      {
        pathname: "/browse",
        search: params.toString(),
      },
      { replace: true }
    );
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    updateURL();
    fetchBooks(true);
  };

  // Handle infinite scroll
  useEffect(() => {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchBooks();
        }
      },
      { threshold: 0.5 }
    );

    if (lastBookElementRef.current) {
      currentObserver.observe(lastBookElementRef.current);
    }

    return () => {
      if (lastBookElementRef.current) {
        currentObserver.unobserve(lastBookElementRef.current);
      }
    };
  }, [lastBookElementRef.current, hasMore, isLoading]);

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

  // Toggle advanced search options
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 pb-12">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12 -z-10"></div>
      <div className="absolute bottom-1/4 -right-16 w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12 -z-10"></div>

      {/* Search Section */}
      <div className="pt-8 pb-12 px-4 mx-auto max-w-7xl relative">
        <div className="text-center mt-20 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Books</h1>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Search our extensive catalog or explore curated collections
          </p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 shadow-xl max-w-4xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-10 pr-4 py-3 w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-200"
              >
                Search
              </button>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <button
                type="button"
                onClick={toggleAdvancedSearch}
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
              >
                {showAdvancedSearch ? "Hide" : "Show"} Advanced Options
                <svg
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    showAdvancedSearch ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center md:hidden"
              >
                {showFilters ? "Hide" : "Show"} Filters
                <svg
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Advanced Search Options */}
            {showAdvancedSearch && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-indigo-900/30">
                <div>
                  <label className="block text-indigo-300 text-sm mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-indigo-300 text-sm mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-indigo-300 text-sm mb-1">
                    Filter
                  </label>
                  <select
                    value={filterBy}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Books</option>
                    <option value="free-ebooks">Free E-Books</option>
                    <option value="paid-ebooks">Paid E-Books</option>
                    <option value="ebooks">All E-Books</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8">
          {/* Filters sidebar - Hidden on mobile */}
          <div
            className={`col-span-12 md:col-span-3 lg:col-span-2 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 p-4 sticky top-4">
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => {
                        setCategory(cat.value);
                        updateURL();
                        fetchBooks(true);
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                        category === cat.value
                          ? "bg-indigo-600 text-white"
                          : "text-indigo-300 hover:bg-indigo-900/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-indigo-900/30 mt-6 pt-6">
                <h3 className="text-white font-semibold mb-4">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="sortBy"
                      value="relevance"
                      checked={sortBy === "relevance"}
                      onChange={handleSortChange}
                      className="mr-2 text-indigo-600"
                    />
                    Relevance
                  </label>
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="sortBy"
                      value="newest"
                      checked={sortBy === "newest"}
                      onChange={handleSortChange}
                      className="mr-2 text-indigo-600"
                    />
                    Newest
                  </label>
                </div>
              </div>

              <div className="border-t border-indigo-900/30 mt-6 pt-6">
                <h3 className="text-white font-semibold mb-4">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="filterBy"
                      value="all"
                      checked={filterBy === "all"}
                      onChange={handleFilterChange}
                      className="mr-2 text-indigo-600"
                    />
                    All Books
                  </label>
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="filterBy"
                      value="free-ebooks"
                      checked={filterBy === "free-ebooks"}
                      onChange={handleFilterChange}
                      className="mr-2 text-indigo-600"
                    />
                    Free E-Books
                  </label>
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="filterBy"
                      value="paid-ebooks"
                      checked={filterBy === "paid-ebooks"}
                      onChange={handleFilterChange}
                      className="mr-2 text-indigo-600"
                    />
                    Paid E-Books
                  </label>
                  <label className="flex items-center text-indigo-300 text-sm">
                    <input
                      type="radio"
                      name="filterBy"
                      value="ebooks"
                      checked={filterBy === "ebooks"}
                      onChange={handleFilterChange}
                      className="mr-2 text-indigo-600"
                    />
                    All E-Books
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* Show search metadata if results exist */}
            {books.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {searchTerm
                    ? `Results for "${searchTerm}"`
                    : category !== "all"
                    ? `Browsing ${
                        categories.find((cat) => cat.value === category)
                          ?.label || category
                      }`
                    : "Browse Books"}
                </h2>
                <p className="text-indigo-400 text-sm">
                  {books.length} books found
                </p>
              </div>
            )}

            {/* Loading indicator for initial load */}
            {isLoading && books.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                <p className="ml-3 text-indigo-300">Loading books...</p>
              </div>
            )}

            {/* Books grid */}
            {books.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book, index) => {
                  // Check if this is the last element for infinite scrolling
                  const isLastElement = index === books.length - 1;

                  return (
                    <div
                      key={`${book.id}-${index}`}
                      ref={isLastElement ? lastBookElementRef : null}
                      className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden hover:border-indigo-700/30 transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Book cover */}
                      <div className="relative pt-[140%]">
                        {book.imageLinks && book.imageLinks.thumbnail ? (
                          <img
                            src={book.imageLinks.thumbnail.replace(
                              "http:",
                              "https:"
                            )} // Ensure HTTPS
                            alt={`Cover of ${book.title}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-indigo-900/20 flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-indigo-400/40"
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

                        {/* Rating badge if available */}
                        {book.averageRating > 0 && (
                          <div className="absolute top-2 right-2 bg-indigo-900/80 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded text-xs font-medium flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {book.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Book details */}
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-white font-semibold line-clamp-2 mb-1">
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

                        {/* Book description */}
                        <p className="text-indigo-200 text-sm mb-4 line-clamp-3">
                          {book.description
                            ? truncateText(book.description, 150)
                            : "No description available"}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-auto space-y-2">
                          <a
                            href={book.previewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
                          >
                            Preview
                          </a>
                          <button
                            className="block w-full py-2 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
                            onClick={() =>
                              console.log("Reserve clicked for", book.id)
                            }
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No results state */}
            {!isLoading && books.length === 0 && !error && (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-indigo-400/30 mx-auto mb-4"
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
                {searchTerm ? (
                  <>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No books found
                    </h3>
                    <p className="text-indigo-300 max-w-md mx-auto">
                      Try adjusting your search terms or browse our categories
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Discover Books
                    </h3>
                    <p className="text-indigo-300 max-w-md mx-auto">
                      Search for books or select a category to start browsing
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Loading more indicator */}
            {isLoading && books.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mr-2"></div>
                <p className="text-indigo-300">Loading more books...</p>
              </div>
            )}

            {/* End of results message */}
            {!isLoading && !hasMore && books.length > 0 && (
              <div className="text-center py-8 text-indigo-400">
                You&#39;ve reached the end of the results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
