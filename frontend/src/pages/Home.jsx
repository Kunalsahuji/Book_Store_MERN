import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../services/bookService";
import BookCard from "../components/BookCard";

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllBooks()
            .then((res) => setBooks(res.data.books))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center mt-6">Loading books...</p>;

    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-6 mt-10 space-y-4">
                <div className="w-32 h-32 md:w-40 md:h-40">
                    <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        <path
                            d="M 20,20 L 80,20 L 80,80 L 20,80 Z M 30,30 L 70,30 L 70,70 L 30,70 Z"
                            fill="#3B82F6"
                        />
                        <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            fill="white"
                            fontSize="20"
                            fontWeight="bold"
                        >
                            Book
                        </text>
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-700">
                    Welcome to the Book Store 📚
                </h2>
                <p className="text-lg text-gray-500 max-w-xl">
                    This is a full-featured {" "}
                    <span className="font-semibold text-gray-800">MERN stack</span>{" "}project where you can{" "}
                    <span className="font-semibold text-blue-600">Create</span>,{" "}
                    <span className="font-semibold text-yellow-600">Update</span>, and{" "}
                    <span className="font-semibold text-red-600">Delete</span> books.
                    Start by adding your first book and bring your bookshelf to life!
                </p>

                <Link
                    to="/dashboard"
                    onClick={() => window.scrollTo(0, 0)}
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    Create Book
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Create Book Button */}
            <div className="flex justify-end mb-4">
                <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    + Create Book
                </Link>
            </div>

            {/* Book List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {books.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </div>
        </div>
    );
}
