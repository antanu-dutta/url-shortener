import React from "react";
import ThreeDots from "../Loaders/ThreeDots";

const OtpVerificationForm = ({
  otp,
  setOtp,
  error,
  loading,
  timeLeft,
  isActive,
  setIsActive,
  handleEmailVerification,
}) => {
  return (
    <form
      className="mt-24 bg-white shadow-2xl p-8 w-[400px] max-w-full rounded-xl mx-auto"
      onSubmit={handleEmailVerification}
    >
      <h2 className="text-center uppercase tracking-wide text-2xl font-semibold mb-8 text-gray-800">
        Verify Your Email
      </h2>

      {/* OTP Input */}
      <div className="mb-6">
        <label
          htmlFor="otp"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Enter OTP
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Verification Code"
          className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-md py-2 px-3 outline-none text-sm"
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm mb-3 text-red-800">{error}</p>}

      {/* Resend OTP */}
      <div className="flex items-center justify-between mb-4">
        {isActive ? (
          <p className="text-sm text-gray-600">
            Resend OTP in <span className="font-semibold">{timeLeft}s</span>
          </p>
        ) : (
          <button
            type="button"
            disabled={isActive}
            onClick={() => setIsActive(true)}
            className="text-blue-600 text-sm font-medium hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        )}
      </div>

      <p className="text-green-600 text-sm text-center mb-4">
        An OTP has been sent to your email.
      </p>

      <button
        type="submit"
        className="w-full py-2 h-[39px] flex items-center justify-center bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
      >
        {loading ? <ThreeDots /> : "Verify Otp"}
      </button>
    </form>
  );
};

export default OtpVerificationForm;
