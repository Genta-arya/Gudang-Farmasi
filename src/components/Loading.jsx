import React from "react";
import { HashLoader } from "react-spinners";

const LoadingGlobal = () => {
  return (
    <div className="min-h-screen mx-auto flex justify-center items-center">
      <HashLoader size={40} color="#ef4444"/>
    </div>
  );
};

export default LoadingGlobal;
