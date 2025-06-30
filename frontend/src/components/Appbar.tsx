import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import {
  IoCreateOutline,
  IoNotificationsOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/inkwave.svg";
import { motion, AnimatePresence } from "motion/react";
import SearchModal from "./SearchModal";
import { useBlogs } from "../hooks";

export const Appbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { blogs } = useBlogs();

  const rawUserData =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");
  const userData = rawUserData ? JSON.parse(rawUserData) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to={"/blogs"} className="flex items-center space-x-2">
            <img src={logo} className="w-44" />
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative w-full flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-left"
            >
              <IoSearchOutline className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-500 flex-1">Search articles...</span>
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-500">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <IoSearchOutline className="text-xl text-gray-600" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <IoNotificationsOutline className="text-xl text-gray-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <motion.button
              onClick={() => {
                if (userData) {
                  navigate("/publish");
                } else {
                  alert("Please log in to write an article.");
                  navigate("/signup");
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200"
            >
              <IoCreateOutline className="text-lg" />
              <span className="hidden sm:inline">Write</span>
            </motion.button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (userData) {
                    setOpen(!open);
                  } else {
                    alert("Please log in to access profile options.");
                    navigate("/signup");
                  }
                }}
                className="p-1 hover:ring-2 hover:ring-black rounded-full transition-all"
              >
                <Avatar />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Signed in as
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {userData.email || "Guest"}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-blogs"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Articles
                      </Link>
                      <Link
                        to="/drafts"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Drafts
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("userData");
                          sessionStorage.removeItem("token");
                          sessionStorage.removeItem("userData");
                          navigate("/");
                          setOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <SearchModal
        blogs={blogs}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};
