import React, { useState, useEffect, useRef } from "react";
import profile from "../../assets/profile.jpg";
import { ChevronDown, CircleUser, LogOut, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthButtons = ({ user, handleLogout }) => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-5">
      {!user ? (
        <>
          <NavLink to={"/login"}>
            <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              Login
            </button>
          </NavLink>
          <NavLink to={"/register"}>
            <button className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
              Register
            </button>
          </NavLink>
        </>
      ) : (
        <div
          ref={dropdownRef}
          className="flex items-center gap-2 cursor-pointer relative"
          onClick={() => setDropdown((prev) => !prev)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={user.profilePic}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <ChevronDown className="w-5 h-5 text-gray-700" />

          {/* Dropdown */}
          {dropdown && (
            <div className="absolute top-14 left-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              {/* Profile */}
              <NavLink
                to={"/profile"}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-150"
              >
                <CircleUser className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>

              {/* Settings */}
              <NavLink
                to={"/settings"}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-150"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </NavLink>

              {/* Logout */}
              <button
                className="w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
