import React, { useEffect } from "react";
import LoginForm from "../components/Layout/LoginForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NotificationToast from "../components/UI/NotificationToast";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.custom((t) => (
        <NotificationToast
          type="info"
          message={"You are already logged in"}
          t={t}
        />
      ));
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <section>
      <LoginForm />
    </section>
  );
};

export default Login;
