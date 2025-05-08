import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">📚 Book Store</h1>
      <div className="space-x-4">
        {currentPath !== "/" && (
          <Link to="/" className="hover:text-blue-300">
            Home
          </Link>
        )}
        {currentPath !== "/dashboard" && (
          <Link to="/dashboard" className="hover:text-blue-300">
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
}
