import axios from "axios";

const BASE_URL = "http://localhost:5000/api/books";

export const getAllBooks = () => axios.get(BASE_URL);
export const getBook = (id) => axios.get(`${BASE_URL}/${id}`);
export const createBook = (formData) =>
  axios.post(BASE_URL, formData, {
    // headers: { "Content-Type": "multipart/form-data" },
  });
export const updateBook = (id, formData) =>
  axios.put(`${BASE_URL}/${id}`, formData, {
    // headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteBook = (id) => axios.delete(`${BASE_URL}/${id}`);