import logo from "./assets/logo.svg";
const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12 bg-cover bg-no-repeat bg-center w-screen overflow-x-hidden">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl w-5xl font-bold text-white">
          <img src={logo} className="h-16 w-auto"></img>
        </div>
        <nav className="space-x-6">
          <a href="/products" className="text-gray-300 hover:text-white">
            Products
          </a>
          <a href="/pricing" className="text-gray-300 hover:text-white">
            Pricing
          </a>
          <a href="/about" className="text-gray-300 hover:text-white">
            About
          </a>
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-between px-12">
        <div className="w-5xl">
          <h1 className="text-5xl font-bold leading-tight">
            Manage Your Library Like Never Before
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Streamline your library&#39;s operations with secure, user-friendly
            tools designed for both admins and readers.
          </p>
          <div className="mt-6 flex space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Get Started
            </a>
            <a
              href="/browse"
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
            >
              Explore Books
            </a>
          </div>
        </div>
        <div className="flex-grow">
          <img src="" alt="BookVault Hero" className="rounded-lg" />
        </div>
      </main>
    </div>
  );
};

export default App;
