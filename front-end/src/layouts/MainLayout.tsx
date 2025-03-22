import { Link, Outlet } from "react-router-dom";
import ico99Tect from "../assets/icons/ico-99Tech.png";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B1F] via-[#132042] to-[#0B0B1F]">
      {/* Navigation Bar */}
      <nav className="px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={ico99Tect} alt="99Tech Logo" className="h-12" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white font-semibold hover:text-purple-400 transition-colors uppercase"
            >
              Finance
            </Link>
            <Link
              to="/algorithm"
              className="text-white font-semibold hover:text-purple-400 transition-colors uppercase"
            >
              Algorithm
            </Link>
            <Link
              to="/messy-react"
              className="text-white font-semibold hover:text-purple-400 transition-colors uppercase"
            >
              Messy React
            </Link>
            <Link
              to="/architecture"
              className="text-white font-semibold hover:text-purple-400 transition-colors uppercase"
            >
              Crud & Architecture
            </Link>
          </div>

          {/* Join Us Button */}
          {/* <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
            JOIN US!
          </button> */}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
