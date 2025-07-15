import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img
          src="../images/error_icon.png"
          alt="Page Not Found"
          className="w-1/4 mb-6 mx-auto"
        />
        <h1 className="text-6xl text-gray-600 font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! You explored too far!</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
