import axios from "axios";

// In Vite, env vars must be prefixed with VITE_ (not REACT_APP_)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

export const getPosts = async () => {
    try {
        const response = await api.get("/api/posts");
        return response;
    } catch (error) {
        throw error;
    }
};


export const removePost = async (id) => {
    try {
        const response = await api.delete(`/api/posts/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};


export const login = async (payload) => {
    try {
        const response = await api.post("/api/auth/login", payload);
        return response;
    } catch (error) {
        throw error;
    }
};
