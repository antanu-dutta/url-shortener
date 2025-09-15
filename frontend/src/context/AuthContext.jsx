import { useContext, useState } from "react";
import { createContext } from "react";
import { api } from "../api/Api";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (userInfo) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", userInfo);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async ({ email, otp }) => {
    try {
      setLoading(true);
      const { data } = await api.put("/auth/verify-email", { email, otp });
      setLoading(false);
      return data;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/me", { withCredentials: true });
      setUser(data.data);
      setLoading(false);
      return data;
    } catch (error) {
      setUser(null);
      setLoading(false);
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      setLoading(false);
      await getMe();
      return data;
    } catch (error) {
      setLoading(false);
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/logout");
      setUser(data.data);
      setLoading(false);
      return data;
    } catch (error) {
      setUser(null);
      setLoading(false);
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async ({ id, formData }) => {
    try {
      setLoading(true);
      const res = await api.put(`/auth/profile/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.data);
      return res.data;
    } catch (error) {
      return error?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    registerUser,
    loading,
    verifyEmail,
    loginUser,
    getMe,
    user,
    logout,
    updateUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
