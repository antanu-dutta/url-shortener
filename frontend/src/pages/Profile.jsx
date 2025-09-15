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
      <Container className="flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4 sm:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
              <div
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden shadow-md cursor-pointer touch-manipulation"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                  alt={user.name}
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base break-all sm:break-normal">
                  {user.email}
                </p>
                {user.isVerified ? (
                  <span className="mt-2 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" /> Verified
                    Member
                  </span>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-400 text-white rounded-full font-medium">
                    <ShieldOff className="w-3 h-3 sm:w-4 sm:h-4" /> Not Verified
                  </span>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                  Basic Info
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2 break-all sm:break-normal">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-shrink-0">Full Name:</span>
                    <span className="min-w-0">{user.name}</span>
                  </p>
                  <p className="flex items-center gap-2 break-all sm:break-normal">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-shrink-0">Email:</span>
                    <span className="min-w-0">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                  Account Info
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-shrink-0">Joined:</span>
                    <span className="min-w-0">
                      {user.createdAt
                        ? new Date(user.createdAt).toDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-shrink-0">Role:</span>
                    <span className="min-w-0">{user.role || "User"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base touch-manipulation">
                Change Password
              </button>
              <NavLink to={"/edit-profile"}>
                <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base touch-manipulation">
                  Edit Profile
                </button>
              </NavLink>

              <button
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base touch-manipulation"
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt={user.name}
              className="max-w-[90vw] w-full max-w-[400px] max-h-[80vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-200 touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
