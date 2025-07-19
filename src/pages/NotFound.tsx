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
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="text-center">
        <img
          src="/schedulr/error_icon.png"
          alt="Page Not Found"
          className="w-1/4 mb-6 mx-auto"
        />
        <h1 className="text-6xl text-white-600 font-bold mb-4">404</h1>
        <p className="text-xl text-white-600 font-bold mb-4">Oops! Deadlock Detected!</p>
        <p className="text-lg text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.<br />
          Please check the URL or return to the home page.
        </p>
        <a href="/" className="text-green-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
