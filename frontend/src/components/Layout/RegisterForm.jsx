import React, { useEffect, useState } from "react";
import Container from "../UI/Container";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../../validation/auth.validation";
import { useAuth } from "../../context/AuthContext";
import SignupForm from "../UI/SignupForm";
import OtpVerificationForm from "../UI/OtpVerificationForm";
import NotificationToast from "../UI/NotificationToast";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const { registerUser, loading, verifyEmail } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("sendOtp");
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // handle signup
  const handleSendMail = async (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      return setError(result.error?.issues?.[0]?.message);
    }
    const response = await registerUser(result.data);
    if (!response.success) {
      return setError(response.message);
    }
    setError(null);
    setIsActive(true);
    setStep("verification");
  };

  // handle otp verification
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    const response = await verifyEmail({ email: formData.email, otp });
    if (!response.success) {
      return setError(response.message);
    }
    navigate("/login");
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

  // OTP Timer
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTimeLeft(5);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  return (
    <Container className="flex items-center justify-center px-4 sm:px-6 md:h-[calc(100vh-100px)] ">
      {step === "sendOtp" && (
        <SignupForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          error={error}
          handleSendMail={handleSendMail}
        />
      )}

      {step === "verification" && (
        <OtpVerificationForm
          otp={otp}
          setOtp={setOtp}
          error={error}
          loading={loading}
          timeLeft={timeLeft}
          isActive={isActive}
          setIsActive={setIsActive}
          handleEmailVerification={handleEmailVerification}
        />
      )}
    </Container>
  );
};

export default RegisterForm;
