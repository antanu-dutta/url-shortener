import React, { useState } from "react";
import Container from "../components/UI/Container";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  User,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NotificationToast from "../components/UI/NotificationToast";
import NotFound from "./NotFound";
import { useEffect } from "react";
import SkeletonLoader from "../components/UI/SkeletonLoader";

const Profile = () => {
  const { user, logout, getMe } = useAuth();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await logout();
    if (!response.success) {
      return toast.custom(
        (t) => {
          return (
            <NotificationToast type="error" message={response.message} t={t} />
          );
        },
        {
          id: "success-toast",
          duration: 3000,
        }
      );
    }
    navigate("/login");
    return toast.custom(
      (t) => {
        return (
          <NotificationToast type="success" message={response.message} t={t} />
        );
      },
      {
        id: "success-toast",
        duration: 3000,
      }
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      await getMe();
      setLoading(false);
    };
    fetchUser();
  }, []);
  if (!user) return <NotFound />;
  return (
    <section>
      <Container className="flex items-center justify-center">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
              <div
                className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-md cursor-pointer"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                  alt={user.name}
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                {user.isVerified ? (
                  <span className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded-full font-medium">
                    <ShieldCheck /> Verified Member
                  </span>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-400 text-white rounded-full font-medium">
                    <ShieldOff /> Not Verified
                  </span>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Basic Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" /> Full Name:{" "}
                    {user.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" /> Email:{" "}
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Account Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" /> Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toDateString()
                      : "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" /> Role:{" "}
                    {user.role || "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Change Password
              </button>
              <NavLink to={"/edit-profile"}>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Edit Profile
                </button>
              </NavLink>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* Image Preview Modal */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt={user.name}
              className="max-w-[90vw] w-[400px] max-h-[80vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
