
import BookForm from "../components/BookForm";

export default function Dashboard() {
    return (
        <div className="max-w-xl mx-auto mt-6">
            {/* <h2 className="text-2xl font-bold mb-4">Add New Book</h2> */}
            <BookForm onSuccess={() => window.location.reload()} />
        </div>
    );
}