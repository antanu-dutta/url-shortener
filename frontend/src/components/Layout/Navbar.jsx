import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "../UI/Container";
import { useAuth } from "../../context/AuthContext";
import NotificationToast from "../UI/NotificationToast";
import toast from "react-hot-toast";
import {
  ChevronDown,
  CircleUser,
  LogOut,
  Settings,
  X,
  Menu,
} from "lucide-react";
import { useUrl } from "../../context/UrlContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getUrls } = useUrl();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenu, setMobileMenu] = useState(false); // default false

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const response = await logout();
    const type = response.success ? "success" : "error";
    toast.custom(
      (t) => <NotificationToast type={type} message={response.message} t={t} />,
      { id: "success-toast", duration: 3000 }
    );
    await getUrls();
  };

  return (
    <header className="shadow-primary">
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* logo */}
          <div className="text-xl sm:text-2xl tracking-wider text-gray-800">
            <span className="hidden sm:inline">URL Shortener</span>
            <span className="sm:hidden">URL Short</span>
          </div>

          {/* nav links (desktop only) */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-7">
              <li className="relative">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative tracking-wide text-sm uppercase font-medium transition-colors duration-300 
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-900 hover:text-blue-600"
                      }
                      after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
                      after:bg-blue-600 after:transition-all after:duration-300
                      ${
                        isActive
                          ? "after:w-full"
                          : "after:w-0 hover:after:w-full"
                      }`
                  }
                >
                  Home
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* auth buttons / profile + mobile menu */}
          <div className="flex items-center gap-3 sm:gap-5">
            {!user ? (
              <>
                <NavLink to={"/login"}>
                  <button className="px-3 py-2 sm:px-5 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-sm">
                    Login
                  </button>
                </NavLink>
                <NavLink to={"/register"}>
                  <button className="px-3 py-2 sm:px-5 sm:py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200 cursor-pointer text-sm">
                    Register
                  </button>
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile dropdown */}
                <div
                  ref={dropdownRef}
                  className="flex items-center gap-2 cursor-pointer relative"
                  onClick={() => setDropdown((prev) => !prev)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                    <img
                      src={user.profilePic}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <ChevronDown className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />

                  {/* Dropdown (desktop/tablet only) */}
                  {dropdown && (
                    <div className="absolute top-12 sm:top-14 right-0 sm:left-1 w-48 sm:w-52 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                      <NavLink
                        to={"/profile"}
                        className="flex items-center gap-3 px-4 py-3 sm:py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-150"
                      >
                        <CircleUser className="w-5 h-5" />
                        <span className="text-sm sm:text-base">Profile</span>
                      </NavLink>
                      <NavLink
                        to={"/settings"}
                        className="flex items-center gap-3 px-4 py-3 sm:py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-150"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="text-sm sm:text-base">Settings</span>
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 cursor-pointer text-left px-4 py-3 sm:py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm sm:text-base">Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Icon (only visible on mobile) */}
                <button
                  onClick={() => setMobileMenu(true)}
                  className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50">
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              mobileMenu ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
              <button
                onClick={() => setMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h4>
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <NavLink
                        to="/"
                        onClick={() => setMobileMenu(false)}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        Home
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* User Menu */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Account
                </h4>
                <ul className="space-y-2">
                  <li>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <CircleUser className="w-5 h-5" />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
