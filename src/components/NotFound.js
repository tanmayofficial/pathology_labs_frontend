import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for is under development.</p>
      <Link
        to="/home"
        className="bg-[#e94560] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
