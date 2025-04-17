import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBook, deleteBook } from "../services/bookService";
import toast from "react-hot-toast";
export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBook(id)
      .then((res) => {
        console.log("API Response:", res.data);
        setBook(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch book.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        toast.success("Book deleted successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete book.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading book details...</p>;
  if (!book) return <p className="text-center text-red-600">Book not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-8">
      {book.image && (
        <img
          src={`http://localhost:5000/${book.image}`}
          className="w-full h-96 object-cover rounded-xl mb-4"
          alt={book.title}
        />
      )}
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="text-lg text-gray-600 mb-1">By {book.author}</p>
      <p className="text-green-600 font-semibold text-lg mb-2">
        ₹{parseFloat(book.price).toFixed(2)}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        Released on: {new Date(book.releaseDate).toLocaleDateString()}
      </p>
      {book.description && (
        <p className="mt-4 text-gray-700">{book.description}</p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to={`/book/${id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
