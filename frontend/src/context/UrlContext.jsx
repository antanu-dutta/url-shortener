// src/context/UrlContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";

const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 🔹 Get All URLs */
  const getUrls = async () => {
    try {
      setLoading(true);
      const res = await api.get("/url/urls");
      setUrls(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Get Single URL */
  const getSingleUrl = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/urls/${id}`);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch URL");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Create URL */
  const createUrl = async (newUrl) => {
    try {
      setLoading(true);
      const res = await api.post("/url/create", newUrl);
      console.log(res);
      setUrls((prev) => [res.data.data, ...prev]);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Update URL */
  const updateUrl = async (id, updatedUrl) => {
    try {
      setLoading(true);
      const res = await api.put(`/url/update/${id}`, updatedUrl);
      if (res.data.success) {
        setUrls((prev) =>
          prev.map((url) => (url._id === id ? res.data.data : url))
        );
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update URL");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Delete URL */
  const deleteUrl = async (id) => {
    try {
      setLoading(true);
      const res = await api.delete(`/url/${id}`);
      setUrls((prev) => prev.filter((url) => url._id !== id));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete URL");
    } finally {
      setLoading(false);
    }
  };

  // Fetch URLs on mount
  useEffect(() => {
    getUrls();
  }, []);

  return (
    <UrlContext.Provider
      value={{
        urls,
        loading,
        error,
        getUrls,
        getSingleUrl,
        createUrl,
        updateUrl,
        deleteUrl,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

// 🔹 Custom hook
export const useUrl = () => {
  const context = useContext(UrlContext);
  if (!context) throw new Error("useUrl must be used inside UrlProvider");
  return context;
};
