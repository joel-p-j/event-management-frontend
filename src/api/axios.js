import axios from "axios";

const api = axios.create({
  baseURL: "https://event-management-with-qr-verification.onrender.com/api/",
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://event-management-with-qr-verification.onrender.com/api/auth/refresh/",
          {
            refresh: localStorage.getItem("refresh"),
          }
        );

        localStorage.setItem("access", res.data.access);
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;