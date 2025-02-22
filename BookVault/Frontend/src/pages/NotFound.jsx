import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-12">
    <h1 className="text-6xl font-bold text-red-500">404</h1>
    <p className="text-lg text-gray-300 mt-4">
      Oops! The page you&#39;re looking for doesn&#39;t exist.
    </p>
    <Link
      to="/"
      className="mt-6 bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;