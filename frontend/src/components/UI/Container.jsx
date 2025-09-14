import React from "react";

const Container = ({ children, className }) => {
  return <div className={`max-w-7xl p-4 mx-auto ${className}`}>{children}</div>;
};

export default Container;
