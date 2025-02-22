const Signup = () => (
  <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12">
    <h1 className="text-4xl font-bold text-blue-800">Sign Up</h1>
    <p className="text-gray-600 mt-2">Create an account to get started.</p>
    <form
      className="mt-6 w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      autoComplete="on"
    >
      <div className="mb-4"></div>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 mb-4 border rounded"
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded"
        autoComplete="new-password"
      />
      <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  </div>
);

export default Signup;