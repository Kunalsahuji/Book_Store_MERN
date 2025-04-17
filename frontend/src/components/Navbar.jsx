import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">📚 Book Store</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
      </div>
    </nav>
  );
}