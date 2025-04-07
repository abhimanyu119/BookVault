import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [bookStats, setBookStats] = useState({
    borrowed: 0,
    overdue: 0,
    reserved: 0,
    recommended: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
            "Authorization": `Bearer ${token}`
          }
        };
        
        // Fetch dashboard data
        const [booksResponse, notificationsResponse] = await Promise.all([
          axios.get("/books/user-stats", config),
          axios.get("/user/notifications", config)
        ]);
        
        // Set book statistics
        setBookStats(booksResponse.data.stats || {
          borrowed: 0,
          overdue: 0,
          reserved: 0,
          recommended: 0,
        });
        
        // Set recent books
        setRecentBooks(booksResponse.data.recentBooks || []);
        
        // Set notifications
        setNotifications(notificationsResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          error.response?.data?.message ||
          "Failed to load dashboard data. Please try again."
        );
        
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
  }, [navigate]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get appropriate status class based on due date
  const getDueDateStatusClass = (dueDate) => {
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining < 0) return "text-red-400"; // Overdue
    if (daysRemaining <= 3) return "text-yellow-400"; // Almost due
    return "text-green-400"; // Plenty of time
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 py-8 px-4">
      {/* Abstract book shapes in the background */}
      <div className="fixed top-1/4 -left-20 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12 -z-10"></div>
      <div className="fixed bottom-1/4 -right-16 w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12 -z-10"></div>

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto">
        {/* Error message if any */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Dashboard header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {userData?.name || "Reader"}
          </h1>
          <p className="text-indigo-300 mt-2">
            Manage your reading activity and discover new books
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Borrowed books card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-400 text-sm">Borrowed Books</p>
                <h3 className="text-3xl font-bold text-white mt-1">{bookStats.borrowed}</h3>
              </div>
              <div className="bg-indigo-900/40 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 16V3H10C8.9 3 8 3.9 8 5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 16H8C6.9 16 6 16.9 6 18V19H21V18C21 16.9 20.1 16 19 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <a href="#borrowed" className="text-indigo-400 text-sm flex items-center">
                View all
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Overdue books card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-400 text-sm">Overdue</p>
                <h3 className="text-3xl font-bold text-white mt-1">{bookStats.overdue}</h3>
              </div>
              <div className="bg-red-900/40 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <a href="#overdue" className="text-red-400 text-sm flex items-center">
                Resolve now
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Reserved books card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-yellow-400 text-sm">On Hold</p>
                <h3 className="text-3xl font-bold text-white mt-1">{bookStats.reserved}</h3>
              </div>
              <div className="bg-yellow-900/40 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 12C19.5 11.6022 19.342 11.2206 19.0607 10.9393C18.7794 10.658 18.3978 10.5 18 10.5H14.82L16.32 8.43C16.43 8.29 16.5 8.15 16.5 8C16.5 7.73478 16.3946 7.48043 16.2071 7.29289C16.0196 7.10536 15.7652 7 15.5 7C15.29 7 15.11 7.11 15 7.25L12.01 11H12V7C12 6.73478 11.8946 6.48043 11.7071 6.29289C11.5196 6.10536 11.2652 6 11 6C10.7348 6 10.4804 6.10536 10.2929 6.29289C10.1054 6.48043 10 6.73478 10 7V17C10 17.2652 10.1054 17.5196 10.2929 17.7071C10.4804 17.8946 10.7348 18 11 18C11.2652 18 11.5196 17.8946 11.7071 17.7071C11.8946 17.5196 12 17.2652 12 17V13H12.01L15 16.75C15.11 16.89 15.29 17 15.5 17C15.7652 17 16.0196 16.8946 16.2071 16.7071C16.3946 16.5196 16.5 16.2652 16.5 16C16.5 15.85 16.43 15.71 16.32 15.57L14.82 13.5H18C18.3978 13.5 18.7794 13.342 19.0607 13.0607C19.342 12.7794 19.5 12.3978 19.5 12Z" fill="currentColor" />
                  <path d="M4.5 5V19C4.5 19.5304 4.71071 20.0391 5.08579 20.4142C5.46086 20.7893 5.96957 21 6.5 21H17.5C18.0304 21 18.5391 20.7893 18.9142 20.4142C19.2893 20.0391 19.5 19.5304 19.5 19V5C19.5 4.46957 19.2893 3.96086 18.9142 3.58579C18.5391 3.21071 18.0304 3 17.5 3H6.5C5.96957 3 5.46086 3.21071 5.08579 3.58579C4.71071 3.96086 4.5 4.46957 4.5 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <a href="#reserved" className="text-yellow-400 text-sm flex items-center">
                View all
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Recommendations card */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-400 text-sm">For You</p>
                <h3 className="text-3xl font-bold text-white mt-1">{bookStats.recommended}</h3>
              </div>
              <div className="bg-green-900/40 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H9C10.1046 20 11 19.1046 11 18V6C11 4.89543 10.1046 4 9 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 4H15C13.8954 4 13 4.89543 13 6V8C13 9.10457 13.8954 10 15 10H19C20.1046 10 21 9.10457 21 8V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 14H15C13.8954 14 13 14.8954 13 16V18C13 19.1046 13.8954 20 15 20H19C20.1046 20 21 19.1046 21 18V16C21 14.8954 20.1046 14 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <a href="/browse?recommendations=true" className="text-green-400 text-sm flex items-center">
                Explore recommendations
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current books section - 2 columns on lg screens */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden">
              <div className="p-6 border-b border-indigo-900/30">
                <h2 className="text-xl font-semibold text-white">Currently Borrowed Books</h2>
              </div>

              {recentBooks && recentBooks.length > 0 ? (
                <div className="divide-y divide-indigo-900/30">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                      {/* Book cover */}
                      <div className="w-16 h-24 flex-shrink-0 bg-indigo-900/40 rounded-md overflow-hidden">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Book details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-white">{book.title}</h3>
                        <p className="text-indigo-300 text-sm">{book.author}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div>
                            <span className="text-xs text-indigo-400">Borrowed:</span>
                            <span className="ml-1 text-sm text-indigo-200">{formatDate(book.borrowedDate)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-indigo-400">Due:</span>
                            <span className={`ml-1 text-sm ${getDueDateStatusClass(book.dueDate)}`}>
                              {formatDate(book.dueDate)}
                              {getDaysRemaining(book.dueDate) < 0
                                ? ` (${Math.abs(getDaysRemaining(book.dueDate))} days overdue)`
                                : ` (${getDaysRemaining(book.dueDate)} days left)`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <button
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
                          onClick={() => console.log("Renew clicked for", book.id)}
                        >
                          Renew
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                          onClick={() => console.log("Return clicked for", book.id)}
                        >
                          Return
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <svg className="w-12 h-12 text-indigo-400/40 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-indigo-300">You don&#39;t have any borrowed books</p>
                  <a href="/browse" className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                    Browse the catalog
                  </a>
                </div>
              )}

              {recentBooks && recentBooks.length > 0 && (
                <div className="p-4 text-center border-t border-indigo-900/30">
                  <a href="/account/borrowed" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    View all borrowed books
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Activity & notifications section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden">
              <div className="p-6 border-b border-indigo-900/30">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              </div>

              {notifications && notifications.length > 0 ? (
                <div className="divide-y divide-indigo-900/30">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-indigo-900/20 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Notification icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${notification.type === 'overdue' ? 'bg-red-900/40' :
                          notification.type === 'due_soon' ? 'bg-yellow-900/40' :
                            notification.type === 'available' ? 'bg-green-900/40' :
                              'bg-indigo-900/40'
                          }`}>
                          {notification.type === 'overdue' ? (
                            <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          ) : notification.type === 'due_soon' ? (
                            <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 16V16.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : notification.type === 'available' ? (
                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>

                        {/* Notification content */}
                        <div className="flex-grow">
                          <p className={`text-sm ${notification.type === 'overdue' ? 'text-red-300' :
                            notification.type === 'due_soon' ? 'text-yellow-300' :
                              notification.type === 'available' ? 'text-green-300' :
                                'text-indigo-200'
                            }`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-indigo-400">{formatDate(notification.createdAt)}</span>
                        </div>

                        {/* Mark as read button */}
                        {!notification.read && (
                          <button
                            className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500"
                            title="Mark as read"
                            onClick={() => console.log("Mark as read clicked for", notification.id)}
                          ></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <svg className="w-12 h-12 text-indigo-400/40 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 611C6 14.1585 6 14.6973 5.40493 15.5951L4 17H9M15 17V18C15 20.2091 13.2091 22 11 22C8.79086 22 7 20.2091 7 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>)}</div></div></div></div></div>)
}

export default Dashboard;
