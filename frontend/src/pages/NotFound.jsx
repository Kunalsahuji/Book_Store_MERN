import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-600">404</h1>
            <p className="text-lg">Oops! Page not found.</p>
            <Link to="/" className="mt-4 text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
}