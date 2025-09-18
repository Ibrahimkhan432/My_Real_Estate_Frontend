import React, { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector(selectUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-blue-800">My</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        {/* Search Bar (visible on all screens) */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-slate-100 rounded-full px-3 py-1 shadow-inner flex-1 max-w-md mx-4 sm:mx-6"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none px-2 text-sm flex-1"
          />
          <button className="bg-blue-800 p-2 rounded-full text-white hover:bg-blue-700 transition">
            <FaSearch size={14} />
          </button>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <li>
            <Link
              to="/"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              About
            </Link>
          </li>
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser.img}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition"
              />
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="px-4 py-2 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col gap-3 text-center mb-4">
            <li>
              <Link
                to="/"
                className="block text-slate-600 hover:text-blue-600 transition py-2"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block text-slate-600 hover:text-blue-600 transition py-2"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              {currentUser ? (
                <Link
                  to="/profile"
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <img
                    src={currentUser.img}
                    alt="profile"
                    className="w-10 h-10 rounded-full mx-auto object-cover border-2 border-blue-500"
                  />
                </Link>
              ) : (
                <Link
                  to="/sign-up"
                  className="block px-4 py-2 bg-blue-800 text-white rounded-full hover:bg-blue-700 mx-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
