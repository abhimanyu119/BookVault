import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";

// API endpoints
const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

const Browse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // State for search parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get("q") || ""
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // State for view mode - this is for dashboard integration
  const [viewMode, setViewMode] = useState(searchParams.get("view") || "all");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  // State for saved books when in saved view
  const [savedBooks, setSavedBooks] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const didRunOnce = useRef(false);
  // Ref for infinite scrolling
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

  // Load saved books from localStorage
  useEffect(() => {
    const loadSavedBooks = () => {
      const savedBooksData = localStorage.getItem("savedBooks");
      const parsedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

      // Filter by status if specified
      if (statusFilter !== "all" && statusFilter) {
        return parsedBooks.filter((book) => book.status === statusFilter);
      }

      return parsedBooks;
    };

    // Check if we need to show saved books or load them
    const checkViewMode = () => {
      const viewParam = searchParams.get("view");
      const statusParam = searchParams.get("status");

      if (viewParam === "saved") {
        setViewMode("saved");
        setIsLoadingSaved(true);

        // Load saved books without filter
        const books = loadSavedBooks();
        setSavedBooks(books);
        setIsLoadingSaved(false);
      } else if (statusParam) {
        setStatusFilter(statusParam);
        setViewMode("saved");
        setIsLoadingSaved(true);

        // Load saved books with the specified status filter
        const books = loadSavedBooks();
        setSavedBooks(books);
        setIsLoadingSaved(false);
      } else {
        setViewMode("all");
      }
    };

    // Only check view mode when searchParams or statusFilter changes
    checkViewMode();
  }, [searchParams, statusFilter]);

  // Keep localSearchTerm in sync with searchTerm from URL
  useEffect(() => {
    if (didRunOnce.current) return;
    didRunOnce.current = true;

    const queryParam = searchParams.get("q");
    if (queryParam !== null && searchTerm === "") {
      setSearchTerm(queryParam);
      setLocalSearchTerm(queryParam);
    }

    const categoryParam = searchParams.get("category");
    if (categoryParam !== null) {
      setCategory(categoryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce searchTerm update
  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (searchTerm !== localSearchTerm) {
          setSearchTerm(localSearchTerm);
          updateURL();
          refetch();
        }
      },
      localSearchTerm.trim() === "" ? 0 : 400
    ); // 0ms for full clear, 400ms otherwise

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchTerm]);

  // React Query for fetching books
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "books",
      { q: searchTerm, category, sort: sortBy, filter: filterBy },
    ],
    queryFn: async ({ pageParam = 0 }) => {
      // Construct query
      let query = searchTerm || "subject:all";
      if (category && category !== "all") {
        query += `+subject:${category}`;
      }

      // Add filter if needed
      let filterQuery = "";
      if (filterBy !== "all") {
        filterQuery = `&filter=${filterBy}`;
      }

      const startIndex = pageParam * 10; // Google Books API uses multiples of 10
      const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(
        query
      )}&startIndex=${startIndex}&maxResults=10&orderBy=${sortBy}${filterQuery}`;

      const response = await axios.get(url);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more results to load
      const currentResultCount = allPages.reduce(
        (total, page) => total + (page.items?.length || 0),
        0
      );

      return lastPage.items && currentResultCount < lastPage.totalItems
        ? allPages.length
        : undefined;
    },
    enabled:
      !!(
        searchTerm ||
        category !== "all" ||
        searchParams.get("recommendations") === "true"
      ) && viewMode === "all", // Only run query if not in saved books view
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  // Process the books from React Query result
  const books =
    data?.pages
      .flatMap((page) => page.items || [])
      .map((book) => ({
        id: book.id,
        title: book.volumeInfo?.title || "Unknown Title",
        subtitle: book.volumeInfo?.subtitle || "",
        authors: book.volumeInfo?.authors || ["Unknown Author"],
        publisher: book.volumeInfo?.publisher || "Unknown Publisher",
        publishedDate: book.volumeInfo?.publishedDate || "Unknown Date",
        description: book.volumeInfo?.description || "No description available",
        pageCount: book.volumeInfo?.pageCount || 0,
        categories: book.volumeInfo?.categories || [],
        averageRating: book.volumeInfo?.averageRating || 0,
        ratingsCount: book.volumeInfo?.ratingsCount || 0,
        imageLinks: book.volumeInfo?.imageLinks || {
          thumbnail: null,
          smallThumbnail: null,
        },
        language: book.volumeInfo?.language || "en",
        previewLink: book.volumeInfo?.previewLink || "",
        infoLink: book.volumeInfo?.infoLink || "",
        canonicalVolumeLink: book.volumeInfo?.canonicalVolumeLink || "",
      })) || [];

  // Format saved books for display
  const formattedSavedBooks = savedBooks.map((book) => {
    // Handle both direct book objects and Google Books API format
    const volumeInfo = book.volumeInfo || {};

    return {
      id: book.id || book.googleBookId,
      title: volumeInfo.title || book.title || "Unknown Title",
      subtitle: volumeInfo.subtitle || book.subtitle || "",
      authors: volumeInfo.authors || book.authors || ["Unknown Author"],
      publisher: volumeInfo.publisher || book.publisher || "Unknown Publisher",
      publishedDate:
        volumeInfo.publishedDate || book.publishedDate || "Unknown Date",
      description:
        volumeInfo.description ||
        book.description ||
        "No description available",
      pageCount: volumeInfo.pageCount || book.pageCount || 0,
      categories: volumeInfo.categories || book.categories || [],
      averageRating: volumeInfo.averageRating || book.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || book.ratingsCount || 0,
      imageLinks: volumeInfo.imageLinks ||
        book.imageLinks || {
          thumbnail: null,
          smallThumbnail: null,
        },
      language: volumeInfo.language || book.language || "en",
      previewLink: volumeInfo.previewLink || book.previewLink || "",
      infoLink: volumeInfo.infoLink || book.infoLink || "",
      canonicalVolumeLink:
        volumeInfo.canonicalVolumeLink || book.canonicalVolumeLink || "",
      status: book.status || "saved",
      savedDate: book.savedDate,
    };
  });

  // Set up observer for infinite scrolling
  useEffect(() => {
    const currentRef = lastBookElementRef.current;

    if (
      !currentRef ||
      isFetchingNextPage ||
      !hasNextPage ||
      viewMode === "saved"
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, viewMode]);

  // Update URL with current search parameters
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (category !== "all") params.set("category", category);
    if (viewMode === "saved") params.set("view", "saved");
    if (statusFilter !== "all") params.set("status", statusFilter);

    navigate(
      {
        pathname: "/browse",
        search: params.toString(),
      },
      { replace: true }
    );
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setTimeout(() => {
      updateURL();
      refetch();
    }, 0);
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

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setStatusFilter("all");

    // Update URL and reset saved books if needed
    const params = new URLSearchParams(location.search);

    if (mode === "saved") {
      params.set("view", "saved");
      params.delete("status");
    } else {
      params.delete("view");
      params.delete("status");
    }

    navigate(
      {
        pathname: "/browse",
        search: params.toString(),
      },
      { replace: true }
    );
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);

    // Update URL
    const params = new URLSearchParams(location.search);

    if (status === "all") {
      params.delete("status");
      params.set("view", "saved");
    } else {
      params.set("status", status);
    }

    navigate(
      {
        pathname: "/browse",
        search: params.toString(),
      },
      { replace: true }
    );
  };

  // Determine which books to display based on view mode
  const displayedBooks = viewMode === "saved" ? formattedSavedBooks : books;

  // Determine if we're showing recommendations
  const isShowingRecommendations =
    searchParams.get("recommendations") === "true";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 pb-12">
      {/* Background elements */}
      <div className="fixed top-1/4 left-0 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12 -z-10"></div>
      <div className="fixed bottom-1/4 right-[5%] w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12 -z-10"></div>

      {/* Search Section */}
      <div className="pt-8 pb-12 px-4 mx-auto max-w-7xl relative">
        <div className="text-center mt-20 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {viewMode === "saved"
              ? `${
                  statusFilter !== "all"
                    ? `Books ${
                        statusFilter === "reading"
                          ? "You're Reading"
                          : "You've Finished"
                      }`
                    : "Your Saved Books"
                }`
              : isShowingRecommendations
              ? "Recommended For You"
              : "Browse Books"}
          </h1>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            {viewMode === "saved"
              ? "Manage your personal collection and reading list"
              : "Search our extensive catalog or explore curated collections"}
          </p>
        </div>

        {/* View mode selection tabs - for Dashboard integration */}
        {!isShowingRecommendations && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 p-2 flex overflow-x-auto">
              <button
                onClick={() => handleViewModeChange("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg mr-2 ${
                  viewMode === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-300 hover:bg-indigo-900/40"
                }`}
              >
                Browse Catalog
              </button>
              <button
                onClick={() => handleViewModeChange("saved")}
                className={`px-4 py-2 text-sm font-medium rounded-lg mr-2 ${
                  viewMode === "saved" && statusFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-300 hover:bg-indigo-900/40"
                }`}
              >
                Saved Books
              </button>
              <button
                onClick={() => handleStatusFilterChange("reading")}
                className={`px-4 py-2 text-sm font-medium rounded-lg mr-2 ${
                  statusFilter === "reading"
                    ? "bg-blue-600 text-white"
                    : "text-indigo-300 hover:bg-indigo-900/40"
                }`}
              >
                Reading
              </button>
              <button
                onClick={() => handleStatusFilterChange("finished")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  statusFilter === "finished"
                    ? "bg-green-600 text-white"
                    : "text-indigo-300 hover:bg-indigo-900/40"
                }`}
              >
                Finished
              </button>
            </div>
          </div>
        )}

        {/* Only show search form when not in saved books view */}
        {viewMode !== "saved" && !isShowingRecommendations && (
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
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
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
        )}
      </div>

      {/* Main content */}
      <div className="px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8">
          {/* Filters sidebar - Hidden on mobile and when in saved books view */}
          {viewMode !== "saved" && !isShowingRecommendations && (
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
                          refetch();
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
                  <h3 className="text-white font-semibold mb-4">
                    Availability
                  </h3>
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
          )}

          {/* Results area */}
          <div
            className={`col-span-12 ${
              viewMode !== "saved" && !isShowingRecommendations
                ? "md:col-span-9 lg:col-span-10"
                : ""
            }`}
          >
            {/* Error display */}
            {isError && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                {error?.message || "Failed to load books. Please try again."}
              </div>
            )}

            {/* Show search metadata if results exist */}
            {displayedBooks.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {viewMode === "saved"
                    ? statusFilter !== "all"
                      ? `${
                          statusFilter === "reading"
                            ? "Currently Reading"
                            : "Finished Reading"
                        }`
                      : "Saved for Later"
                    : searchTerm
                    ? `Results for "${searchTerm}"`
                    : category !== "all"
                    ? `Browsing ${
                        categories.find((cat) => cat.value === category)
                          ?.label || category
                      }`
                    : isShowingRecommendations
                    ? "Recommended for You"
                    : "Browse Books"}
                </h2>
                <p className="text-indigo-400 text-sm">
                  {displayedBooks.length} books found
                </p>
              </div>
            )}

            {/* Loading indicator for initial load */}
            {(isLoading || isLoadingSaved) && displayedBooks.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Books grid */}
            {displayedBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedBooks.map((book, index) => {
                  // Check if this is the last element for infinite scrolling (only in API mode)
                  const isLastElement =
                    index === displayedBooks.length - 1 && viewMode !== "saved";

                  // We can't directly forward 'ref' to a custom component
                  // Create a wrapper div for the ref instead
                  return isLastElement ? (
                    <div key={`${book.id}-${index}`} ref={lastBookElementRef}>
                      <BookCard book={book} />
                    </div>
                  ) : (
                    <BookCard key={`${book.id}-${index}`} book={book} />
                  );
                })}
              </div>
            )}

            {/* No results state */}
            {!isLoading &&
              !isLoadingSaved &&
              displayedBooks.length === 0 &&
              !isError && (
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
                  {viewMode === "saved" ? (
                    <>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {statusFilter !== "all"
                          ? `You don't have any books marked as "${statusFilter}"`
                          : "You don't have any saved books"}
                      </h3>
                      <p className="text-indigo-300 max-w-md mx-auto">
                        {statusFilter !== "all"
                          ? "Browse the catalog and update your books' status"
                          : "Start saving books you want to read later"}
                      </p>
                      <button
                        onClick={() => handleViewModeChange("all")}
                        className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                      >
                        Browse the catalog
                      </button>
                    </>
                  ) : searchTerm ? (
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
            {isFetchingNextPage && (
              <div className="w-full py-8">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-6 h-6 border-t-3 border-b-3 border-indigo-500 rounded-full animate-spin mr-2"></div>
                  <p className="text-indigo-300">Loading more books...</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-70">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <BookCardSkeleton
                      key={`infinite-scroll-skeleton-${index}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* End of results message */}
            {!isLoading &&
              !hasNextPage &&
              displayedBooks.length > 0 &&
              viewMode !== "saved" && (
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