
import BookForm from "../components/BookForm";

export default function Dashboard() {
    return (
        <div className="max-w-xl mx-auto mt-6">
            <BookForm onSuccess={() => window.location.reload()} />
        </div>
    );
}