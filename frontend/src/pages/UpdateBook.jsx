import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBook, updateBook } from "../services/bookService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdateBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    // Load book data
    useEffect(() => {
        getBook(id)
            .then((res) => {
                const data = res.data;
                setValue("title", data.title);
                setValue("author", data.author);
                setValue("price", data.price);
                setValue("releaseDate", data.releaseDate.split("T")[0]);
                setValue("description", data.description || "");
                setExistingImage(data.image);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load book.");
            });
    }, [id, setValue]);

    // Submit handler
    const onSubmit = async (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("price", formData.price);
        data.append("releaseDate", formData.releaseDate);
        data.append("description", formData.description || "");

        if (file) {
            data.append("image", file);
        }

        try {
            await updateBook(id, data);
            toast.success("Book updated successfully!");
            navigate(`/book/${id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update book.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4 mt-6">
            <h2 className="text-2xl font-bold mb-4">Update Book</h2>

            <input {...register("title", { required: "Title is required" })} placeholder="Title" className="input" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

            <input {...register("author", { required: "Author is required" })} placeholder="Author" className="input" />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}

            <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                placeholder="Price"
                className="input"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

            <input type="date" {...register("releaseDate", { required: "Release date is required" })} className="input" />
            {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate.message}</p>}

            <textarea {...register("description")} placeholder="Description (optional)" className="input" />

            <div>
                <label className="block mb-1 font-medium">Upload New Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="input"
                />
            </div>

            {/* Show existing image if no new file selected */}
            {existingImage && !file && (
                <div className="mt-2">
                    <p className="text-gray-500 text-sm mb-1">Current Image:</p>
                    <img src={existingImage} alt="Current" className="h-32 object-cover rounded" />
                </div>
            )}

            {/* Show preview if new image selected */}
            {file && (
                <div className="mt-2">
                    <p className="text-gray-500 text-sm mb-1">New Image Preview:</p>
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-32 object-cover rounded" />
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 w-full"
            >
                {isSubmitting ? "Updating..." : "Update Book"}
            </button>
        </form>
    );
}
