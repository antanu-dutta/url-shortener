import React from "react";
import ErrorPhoto from "/404 Error-bro.png";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      {/* Illustration Image */}
      <img
        src={ErrorPhoto} // free 404 illustration
        alt="404 Illustration"
        className="w-72 mb-8"
      />

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>

      {/* Subtext */}
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
