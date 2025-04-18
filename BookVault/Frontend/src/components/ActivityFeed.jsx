import PropTypes from 'prop-types';

const ActivityFeed = ({ notifications, formatDate, onMarkAsRead }) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden">
      <div className="p-6 border-b border-indigo-900/30">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
      </div>
      
      {notifications && notifications.length > 0 ? (
        <div className="divide-y divide-indigo-900/30">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 hover:bg-indigo-900/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Notification icon */}
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    notification.type === "overdue"
                      ? "bg-red-900/40"
                      : notification.type === "due_soon"
                      ? "bg-yellow-900/40"
                      : notification.type === "available"
                      ? "bg-green-900/40"
                      : "bg-indigo-900/40"
                  }`}
                >
                  {notification.type === "overdue" ? (
                    <svg
                      className="w-5 h-5 text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8V12L14 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : notification.type === "due_soon" ? (
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16V16.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : notification.type === "available" ? (
                    <svg
                      className="w-5 h-5 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-indigo-400"
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
                  )}
                </div>

                {/* Notification content */}
                <div className="flex-grow">
                  <p
                    className={`text-sm ${
                      notification.type === "overdue"
                        ? "text-red-300"
                        : notification.type === "due_soon"
                        ? "text-yellow-300"
                        : notification.type === "available"
                        ? "text-green-300"
                        : "text-indigo-200"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <span className="text-xs text-indigo-400">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>

                {/* Mark as read button */}
                {!notification.read && (
                  <button
                    className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500"
                    title="Mark as read"
                    onClick={() => onMarkAsRead(notification.id)}
                  ></button>
                )}
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
              d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11C6 14.1585 6 14.6973 5.40493 15.5951L4 17H9M15 17V18C15 20.2091 13.2091 22 11 22C8.79086 22 7 20.2091 7 18V17M15 17H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-indigo-300">No recent activity</p>
        </div>
      )}
    </div>
  );
};

ActivityFeed.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["overdue", "due_soon", "available", "other"])
        .isRequired,
      message: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
    })
  ).isRequired,
  formatDate: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
};

export default ActivityFeed;
