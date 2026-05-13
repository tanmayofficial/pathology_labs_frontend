import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import React from "react";
import { Link } from "react-router-dom";

const GoBack = () => {
  return (
    <div className="absolute flex items-center space-x-2 mt-2">
      <ArrowLeftIcon className="h-6 w-6 text-gray-800 transition duration-200" />
      <Link
        to="/home"
        className="text-gray-800 hover:text-gray-500 font-medium transition duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default GoBack;
