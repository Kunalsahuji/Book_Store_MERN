import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createBook } from "../services/bookService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function BookForm({ onSuccess }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const [file, setFile] = useState(null);
    const onSubmit = async (data) => {
        const formData = new FormData();

        if (file) {
            formData.append("image", file);
        }

        Object.entries(data).forEach(([key, value]) =>
            formData.append(key, value)
        );

        try {
            await createBook(formData);
            toast.success("Book added successfully!");
            // reset();
            // setFile(null);
            // if (onSuccess) onSuccess();
            navigate("/"); // ⬅️ navigate to homepage after success
        } catch (err) {
            toast.error("Failed to add book.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 max-w-xl mx-auto p-4 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-2">Add a New Book</h2>

            <input
                {...register("title", { required: "Title is required" })}
                placeholder="Title"
                className="input"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

            <input
                {...register("author", { required: "Author is required" })}
                placeholder="Author"
                className="input"
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}

            <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                placeholder="Price"
                className="input"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

            <input
                type="date"
                {...register("releaseDate", { required: "Release date is required" })}
                className="input"
            />
            {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate.message}</p>}

            <textarea
                {...register("description")}
                placeholder="Description"
                className="input"
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="input"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
            >
                {isSubmitting ? "Submitting..." : "Add Book"}
            </button>
        </form>
    );
}
