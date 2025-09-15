import React, { useState } from "react";
import Container from "../components/UI/Container";
import { useAuth } from "../context/AuthContext";
import { Camera, Save, ArrowLeft, EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NotificationToast from "../components/UI/NotificationToast";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
  });

  const [preview, setPreview] = useState(user?.profilePic || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await updateUser({ id: user._id, formData });
      if (!res.success) {
        setError(res.message);
      } else {
        navigate("/profile");
        toast.custom((t) => (
          <NotificationToast type="success" message={res.message} t={t} />
        ));
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Container className="flex items-center justify-center">
        <div className="bg-white rounded shadow-xl w-full max-w-2xl p-8 mt-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit Profile
            </h2>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden shadow-md">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow hover:bg-blue-700 transition"
                >
                  <Camera size={18} />
                </label>
                <input
                  id="profilePic"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your Name"
                className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Your Email"
                className="border border-gray-300 w-full bg-gray-100 disabled:bg-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default EditProfile;
