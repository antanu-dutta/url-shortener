import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = ({ user }) => {
  return (
    <nav>
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
  );
};

export default NavLinks;
