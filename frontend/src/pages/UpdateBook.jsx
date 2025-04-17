// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getBook, updateBook } from "../services/bookService";
// import toast from "react-hot-toast";

// export default function UpdateBook() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         title: "",
//         author: "",
//         price: "",
//         releaseDate: "",
//         description: "",
//     });

//     useEffect(() => {
//         getBook(id)
//             .then((res) => {
//                 const book = res.data;
//                 setFormData({
//                     title: book.title,
//                     author: book.author,
//                     price: book.price,
//                     releaseDate: book.releaseDate.slice(0, 10),
//                     description: book.description || "",
//                 });
//             })
//             .catch((err) => {
//                 console.error(err);
//                 toast.error("Failed to fetch book.");
//             });
//     }, [id]);

//     const handleChange = (e) =>
//         setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await updateBook(id, formData);
//             toast.success("Book updated successfully!");
//             navigate(`/book/${id}`);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to update book.");
//         }
//     };

//     return (
//         <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-8">
//             <h1 className="text-2xl font-bold mb-4">Update Book</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     type="text"
//                     name="title"
//                     placeholder="Title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 />
//                 <input
//                     type="text"
//                     name="author"
//                     placeholder="Author"
//                     value={formData.author}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 />
//                 <input
//                     type="number"
//                     name="price"
//                     placeholder="Price"
//                     value={formData.price}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 />
//                 <input
//                     type="date"
//                     name="releaseDate"
//                     value={formData.releaseDate}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 />
//                 <textarea
//                     name="description"
//                     placeholder="Description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 />
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
//                 >
//                     Update Book
//                 </button>
//             </form>
//         </div>
//     );
// }
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

            {existingImage && !file && (
                <div className="mt-2">
                    <p className="text-gray-500 text-sm mb-1">Current Image:</p>
                    <img src={`http://localhost:5000/${existingImage}`} alt="Current" className="h-32 object-cover rounded" />
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
