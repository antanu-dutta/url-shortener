import React, { useEffect, useState } from "react";
import Container from "../UI/Container";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginSchema } from "../../validation/auth.validation";
import { toast } from "react-hot-toast";
import NotificationToast from "../UI/NotificationToast";
import { useAuth } from "../../context/AuthContext";
import ThreeDots from "../Loaders/ThreeDots";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { data, error } = loginSchema.safeParse(formData);
    if (error) {
      return setError(error?.issues?.[0].message);
    }
    // api call
    const response = await loginUser(data);
    setError(null);
    if (!response?.success) {
      return setError(response?.message);
    }
    navigate("/");
    toast.custom(
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

  return (
    <Container
      className={`flex items-center justify-center px-4 sm:px-6 md:h-[calc(100vh-100px)] `}
    >
      <form
        className="mt-3 sm:mt-0 bg-white shadow-2xl p-4 sm:p-6 w-full max-w-[400px] sm:w-[400px] rounded-xl"
        onSubmit={handleSubmit}
      >
        {/* Heading */}
        <h2 className="text-center uppercase tracking-widest text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-800">
          Login
        </h2>

        {/* Email Field */}
        <div className="mb-5 sm:mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Your Email"
            className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2.5 sm:py-2 px-3 outline-none text-sm transition duration-150"
          />
        </div>

        {/* Password Field */}
        <div className="mb-5 sm:mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
          >
            Password
          </label>
          <div className="flex items-center border border-gray-300 bg-gray-100 rounded px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition duration-150">
            <input
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent py-2.5 sm:py-2 outline-none text-sm"
            />
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700 p-1 touch-manipulation"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm mb-3 text-red-800">{error}</p>}

        <div className="my-4 flex items-center">
          <input
            id="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={() =>
              setFormData((prev) => ({ ...prev, remember: !prev.remember }))
            }
            className="w-4 h-4 sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
          >
            Remember Me
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 sm:py-2 h-[42px] sm:h-[39px] flex items-center justify-center bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200 text-sm sm:text-base touch-manipulation"
        >
          {loading ? <ThreeDots /> : "Login"}
        </button>
        <p className="mt-3 text-center text-sm">
          Don't have an account ?{" "}
          <NavLink to={"/register"} className={"text-blue-600 underline"}>
            Create one
          </NavLink>
        </p>
      </form>
    </Container>
  );
};

export default LoginForm;
