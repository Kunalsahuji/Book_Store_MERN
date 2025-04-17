import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      {book.image && (
        <img
          src={`http://localhost:5000/${book.image}`}
          alt={book.title}
          className="h-48 w-full object-cover rounded"
        />
      )}
      <h2 className="text-xl font-semibold mt-2 truncate">{book.title}</h2>
      <p className="text-gray-500">{book.author}</p>
      <p className="text-green-600 font-semibold">₹{parseFloat(book.price).toFixed(2)}</p>
      <p className="text-sm text-gray-400">
        Released: {new Date(book.releaseDate).toLocaleDateString()}
      </p>
      <Link
        to={`/book/${book._id}`}
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        View Details
      </Link>
    </div>
  );
}