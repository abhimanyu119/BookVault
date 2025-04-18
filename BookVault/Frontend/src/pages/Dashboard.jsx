import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

// Import components
import StatCard from "../components/StatCard";
import SavedBooksList from "../components/SavedBooksList";
import ActivityFeed from "../components/ActivityFeed";
import RecommendationsWidget from "../components/RecommendationsWidget";

// Icons for stat cards
const SavedBooksIcon = () => (
  <svg
    className="w-6 h-6 text-current"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReadingIcon = () => (
  <svg
    className="w-6 h-6 text-current"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FinishedIcon = () => (
  <svg
    className="w-6 h-6 text-current"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RecommendedIcon = () => (
  <svg
    className="w-6 h-6 text-current"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H9C10.1046 20 11 19.1046 11 18V6C11 4.89543 10.1046 4 9 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 4H15C13.8954 4 13 4.89543 13 6V8C13 9.10457 13.8954 10 15 10H19C20.1046 10 21 9.10457 21 8V6C21 4.89543 20.1046 4 19 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 14H15C13.8954 14 13 14.8954 13 16V18C13 19.1046 13.8954 20 15 20H19C20.1046 20 21 19.1046 21 18V16C21 14.8954 20.1046 14 19 14Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [bookStats, setBookStats] = useState({
    saved: 0,
    reading: 0,
    finished: 0,
    recommended: 0,
  });
  const [savedBooks, setSavedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // Parse user data
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUserData(parsedUser);

        // Configure headers with token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Get saved books from localStorage
        const savedBooksData = localStorage.getItem("savedBooks");
        console.log("Saved Books Data: ", savedBooksData);
        const parsedSavedBooks = savedBooksData
          ? JSON.parse(savedBooksData)
          : [];

        // Fetch notifications from our backend
        const notificationsResponse = await axios.get(
          "/user/notifications",
          config
        );

        // Calculate stats based on saved books
        const stats = {
          saved: parsedSavedBooks.length || 0,
          reading:
            parsedSavedBooks.filter((book) => book.status === "reading")
              .length || 0,
          finished:
            parsedSavedBooks.filter((book) => book.status === "finished")
              .length || 0,
          recommended: 5, // Example placeholder - could be calculated based on user preferences
        };

        // Set book statistics
        setBookStats(stats);

        // Set saved books
        setSavedBooks(parsedSavedBooks || []);

        // Set notifications
        setNotifications(notificationsResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to save a book
  // const saveBook = (book) => {
  //   // Get existing saved books
  //   const savedBooksData = localStorage.getItem("savedBooks");
  //   const currentSavedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

  //   // Prepare the book data with Google Books API structure in mind
  //   const bookToSave = {
  //     id: book.id,
  //     googleBookId: book.id, // Store Google Books ID
  //     savedDate: new Date().toISOString(),
  //     // If the book is from Google Books API
  //     volumeInfo: book.volumeInfo || {
  //       title: book.title,
  //       authors: book.authors || [book.author],
  //       categories: book.categories || [book.category],
  //       imageLinks: {
  //         thumbnail: book.coverImage,
  //       },
  //       description: book.description,
  //     },
  //   };

  //   // Add to saved books if not already saved
  //   const isAlreadySaved = currentSavedBooks.some(
  //     (savedBook) =>
  //       savedBook.id === book.id || savedBook.googleBookId === book.id
  //   );

  //   if (!isAlreadySaved) {
  //     const updatedSavedBooks = [...currentSavedBooks, bookToSave];
  //     localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
  //     setSavedBooks(updatedSavedBooks);

  //     // Update stats
  //     setBookStats((prev) => ({
  //       ...prev,
  //       saved: prev.saved + 1,
  //     }));
  //   }
  // };

  // Function to remove a book from saved
  const removeBook = (bookId) => {
    const savedBooksData = localStorage.getItem("savedBooks");
    const currentSavedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];

    const updatedSavedBooks = currentSavedBooks.filter(
      (book) => book.id !== bookId && book.googleBookId !== bookId
    );

    localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks));
    setSavedBooks(updatedSavedBooks);

    // Update stats
    setBookStats((prev) => ({
      ...prev,
      saved: prev.saved - 1,
    }));
  };

  
  const refreshSavedBooks = () => {
    const savedBooksData = localStorage.getItem("savedBooks");
    if (savedBooksData) {
      const parsedBooks = JSON.parse(savedBooksData);
      setSavedBooks(parsedBooks);

      // Update stats too
      setBookStats({
        saved: parsedBooks.length || 0,
        reading:
          parsedBooks.filter((book) => book.status === "reading").length || 0,
        finished:
          parsedBooks.filter((book) => book.status === "finished").length || 0,
        recommended: 5,
      });
    }
  };

  // Add the storage event listener for cross-tab updates
  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "savedBooks") {
        refreshSavedBooks();
      }
    });

    return () => {
      window.removeEventListener("storage", (event) => {
        if (event.key === "savedBooks") {
          refreshSavedBooks();
        }
      });
    };
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // View book details handler
  const handleViewDetails = (bookId) => {
    console.log("View details clicked for", bookId);
    // Navigate to book details using the appropriate ID format
    navigate(`/books/${bookId}`);
  };

  // Mark notification as read handler
  const handleMarkAsRead = (notificationId) => {
    console.log("Mark as read clicked for", notificationId);
    // Implementation would update the notification in the backend
    // This is a placeholder for the actual implementation
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-200">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 py-8 px-4">
      {/* Abstract book shapes in the background */}
      <div className="fixed top-1/4 -left-20 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12 -z-10"></div>
      <div className="fixed bottom-1/4 -right-16 w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12 -z-10"></div>

      {/* Main content wrapper */}
      <div className="max-w-7xl min-h-full mx-auto">
        {/* Dashboard header */}
        <div className="mt-20 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {userData?.name || "Reader"}
          </h1>
          <p className="text-indigo-300 mt-2">
            Manage your reading activity and discover new books
          </p>
        </div>

        {/* Dashboard navigation tabs - simplified to just Overview */}
        <div className="mb-6">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 p-2 flex justify-between overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 text-sm font-medium rounded-lg mr-2 bg-indigo-600 text-white"
            >
              Overview
            </button>
            <button
              onClick={refreshSavedBooks}
              className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md ml-2 mt-0"
              title="Refresh saved books"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Saved Books"
            count={bookStats.saved}
            icon={<SavedBooksIcon />}
            color="indigo"
            linkText="View all"
            linkUrl="/browse?view=saved"
          />

          <StatCard
            title="Reading"
            count={bookStats.reading}
            icon={<ReadingIcon />}
            color="blue"
            linkText="View all"
            linkUrl="/browse?status=reading"
          />

          <StatCard
            title="Finished"
            count={bookStats.finished}
            icon={<FinishedIcon />}
            color="green"
            linkText="View history"
            linkUrl="/browse?status=finished"
          />

          <StatCard
            title="Recommended"
            count={bookStats.recommended}
            icon={<RecommendedIcon />}
            color="purple"
            linkText="Explore recommendations"
            linkUrl="/browse?recommendations=true"
          />
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved books section - 2 columns on lg screens */}
          <div className="lg:col-span-2">
            {/* Saved Books List Component */}
            <SavedBooksList
              books={savedBooks}
              formatDate={formatDate}
              onViewDetails={handleViewDetails}
              onRemove={removeBook}
            />

            {/* Recommendations Widget Component */}
            {savedBooks && savedBooks.length > 0 && <RecommendationsWidget />}
          </div>

          {/* Activity & notifications section */}
          <div className="lg:col-span-1">
            {/* Activity Feed Component */}
            <ActivityFeed
              notifications={notifications}
              formatDate={formatDate}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;