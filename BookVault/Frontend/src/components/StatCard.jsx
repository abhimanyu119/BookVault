import PropTypes from "prop-types";


const StatCard = ({ title, count, icon, color, linkText, linkUrl }) => {
  const colorClasses = {
    indigo: {
      text: "text-indigo-400",
      bg: "bg-indigo-900/40",
    },
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-900/40",
    },
    green: {
      text: "text-green-400",
      bg: "bg-green-900/40",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-900/40",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-900/40",
    },
    yellow: {
      text: "text-yellow-400",
      bg: "bg-yellow-900/40",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className={`${currentColor.text} text-sm`}>{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{count}</h3>
        </div>
        <div className={`${currentColor.bg} p-3 rounded-lg`}>{icon}</div>
      </div>
      <div className="mt-4">
        <a
          href={linkUrl}
          className={`${currentColor.text} text-sm flex items-center`}
        >
          {linkText}
          <svg
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5L19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "indigo",
    "blue",
    "green",
    "purple",
    "red",
    "yellow",
  ]).isRequired,
  linkText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
};

export default StatCard;
