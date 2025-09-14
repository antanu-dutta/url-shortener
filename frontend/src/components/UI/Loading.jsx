import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center gap-4 z-50">
      <p className="text-white text-lg font-medium">Loading...</p>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default Loading;
