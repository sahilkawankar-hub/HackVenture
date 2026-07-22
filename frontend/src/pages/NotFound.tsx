import { Link } from "react-router-dom";

/**
 * 404 Not Found page.
 */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-indigo-500">404</h1>
      <p className="mt-4 text-xl text-slate-400">Page not found</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
