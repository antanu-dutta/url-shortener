import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Navbar from "./components/Layout/Navbar";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/UI/Loading";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";

const App = () => {
  const [loading, setLoading] = useState(true);
  const { getMe, user } = useAuth();

  const fetchUser = async () => {
    await getMe();
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
