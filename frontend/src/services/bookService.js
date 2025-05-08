import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllBooks = () => axios.get(`${BASE_URL}`);
export const getBook = (id) => axios.get(`${BASE_URL}/${id}`);
export const createBook = (formData) => axios.post(`${BASE_URL}`, formData);
export const updateBook = (id, formData) => axios.put(`${BASE_URL}/${id}`, formData);
export const deleteBook = (id) => axios.delete(`${BASE_URL}/${id}`);
