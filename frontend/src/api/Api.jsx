import axios from "axios";
import toast from "react-hot-toast";
import NotificationToast from "../components/UI/NotificationToast";

// ✅ Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ✅ Attach interceptor to the api instance, not global axios
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      toast.custom((t) => (
        <NotificationToast
          type="error"
          message="Server not connected. Please try again later."
          t={t}
        />
      ));
    }
    return Promise.reject(error);
  }
);
