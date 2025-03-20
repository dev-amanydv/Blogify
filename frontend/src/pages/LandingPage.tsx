"use client";

import { motion } from "framer-motion";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-gray-600 text-gray-800 text-center p-8">
      {/* Title Animation */}
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Blogify
      </motion.h1>

      {/* Description Animation */}
      <motion.p
        className="text-lg max-w-2xl mb-8 text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Discover insightful articles, share your thoughts, and be part of a thriving blogging community.
      </motion.p>

      {/* Buttons Animation */}
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button onClick={()=> {
            navigate('/signup')
        }} className="bg-green-700  hover:bg-green-600">Get Started</Button>
        <Button onClick={()=> {
            navigate('/signin')
        }} className="bg-gray-800 hover:bg-gray-900">Login</Button>
      </motion.div>
    </div>
  );
}