import React from "react";

const ThreeDots = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black/50 bg-opacity-50 flex flex-col items-center justify-center gap-4 z-50">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default ThreeDots;
