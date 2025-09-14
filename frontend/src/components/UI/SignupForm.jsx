import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ThreeDots from "../Loaders/ThreeDots";

const SignupForm = ({
  formData,
  setFormData,
  handleSendMail,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="mt-32 bg-white shadow-2xl p-6 w-[400px] max-w-full rounded-xl"
      onSubmit={handleSendMail}
    >
      <h2 className="text-center uppercase tracking-widest text-2xl font-semibold mb-8 text-gray-800">
        Signup
      </h2>

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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Your Email"
          className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="flex items-center border border-gray-300 bg-gray-100 rounded px-3">
          <input
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent py-2 outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-3">
        <label
          htmlFor="confirmPassword"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="flex items-center border border-gray-300 bg-gray-100 rounded px-3">
          <input
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full bg-transparent py-2 outline-none text-sm"
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm mb-3 text-red-800">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 h-[39px] flex items-center justify-center bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
      >
        {loading ? <ThreeDots /> : "Send OTP"}
      </button>

      <p className="mt-3 text-center text-sm">
        Already have an account?{" "}
        <NavLink to="/login" className="text-blue-600 underline">
          Login
        </NavLink>
      </p>
    </form>
  );
};

export default SignupForm;
