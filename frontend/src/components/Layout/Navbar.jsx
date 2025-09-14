import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "../UI/Container";
import AuthButtons from "../UI/AuthButtons";
import NavLinks from "../UI/NavLinks";
import { useAuth } from "../../context/AuthContext";
import NotificationToast from "../UI/NotificationToast";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();

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

  return (
    <header className="shadow-primary">
      <Container>
        <div className="flex items-center justify-between">
          {/* logo */}
          <div className="text-2xl tracking-wider text-gray-800">
            URL Shortener
          </div>

          {/* nav links */}
          <NavLinks user={user} />

          {/* auth buttons */}
          <AuthButtons user={user} handleLogout={handleLogout} />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
