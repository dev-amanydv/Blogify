"use client";

import { motion } from "framer-motion";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import NewsletterSignup from "../components/NewsletterSignup";
import logo from "../assets/inkwave.svg";
import paper_plane_light from "../assets/paper-plane-black.svg";
import feat_bg from "../assets/feat-bg.svg"
import bg_1 from "../assets/bg-1.svg"
import hero from "../assets/hero-2.svg"
import { IoCreate } from "react-icons/io5";
import { CiSaveDown2 } from "react-icons/ci";
import { RiUserCommunityFill } from "react-icons/ri";
import { MdPrivacyTip } from "react-icons/md";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-contain bg-no-repeat  w-full" style={{ backgroundImage: `url(${bg_1})` }}>
      <div className="z-50">
        {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between px-6 py-2 max-w-7xl mx-auto"
      >
        <div className="flex items-center space-x-2">
          <img src={logo} className="w-44" />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </button>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r text-white from-black via-gray-800 to-black hover:shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <motion.h1
            className="text-6xl relative font-bold mb-6 bg-gradient-to-b from-gray-500 via-gray-900 to-black bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={paper_plane_light}
              className="absolute hidden lg:block left-2/3 -top-16"
              width={200}
              alt=""
            />
            Share Your Story
            <br />
            <span className="text-gray-900">With the World</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of writers who trust InkWave to publish their ideas,
            build their audience, and create meaningful connections through the
            power of words.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onClick={() => navigate("/signup")}
              className="bg-black text-white rounded-lg hover:shadow-xl text-lg px-8 py-4"
            >
              Start Writing Today
            </motion.button>
            <motion.button
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onClick={() => navigate("/blogs")}
              className=" text-black rounded-lg border-2 border-gray-500 hover:border-gray-400 hover:shadow-lg text-lg px-8 py-4"
            >
              Explore Stories
            </motion.button>
          </motion.div>
        </div>
        <div className="relative">
          <img src={hero} className="mx-auto" alt="" />
          <div className="absolute w-full bottom-0 bg-gradient-to-t from-white to-transparent h-1/4"></div>
        </div>
        <div className="mt-20 font-medium text-lg w-fit mx-auto px-4 rounded-full border-2 border-gray-500 text-center">
          Why Choose Us?
        </div>

        {/* Features Grid */}
        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }} className="grid grid-cols-3 my-14 grid-rows-12 md:grid-rows-6 w-full text-white h-auto gap-5 ">
          <motion.div whileHover={{scale:1.03}} transition={{duration:0.3}} style={{ backgroundImage: `url(${feat_bg})` }} className="bg-gray-100 bg-cover w-full items-center justify-center flex relative rounded-md h-72 row-span-3 col-span-3 md:col-span-2  ">
            <div className=" px-4 flex flex-col gap-10  ">
              <div className="bg-gray-900 w-fit p-3 rounded-lg"><IoCreate className="text-5xl text-white" /></div>
              <div className="">
                <h1 className="text-2xl font-bold text-black">
                Rich Text Editor
                </h1>
                <p className="text-gray-600">
                  Write your way with a powerful editor built for creativity and
                  clarity.{" "}
                </p>
              </div>
              
            </div>
          </motion.div>
          <motion.div whileHover={{scale:1.03}} transition={{duration:0.3}} style={{ backgroundImage: `url(${feat_bg})` }} className="bg-gray-100 bg-cover  overflow-hidden flex items-center justify-center  relative rounded-md row-span-3 col-span-3 md:col-span-1 md:row-span-6  ">

            <div className=" px-4 flex flex-col gap-10  ">
              <div className="bg-gray-900 w-fit p-3 rounded-lg"><CiSaveDown2 className="text-5xl text-white" /></div>
              <div className="">
                <h1 className="text-2xl font-bold text-black">
                  Drafts & Autosave                </h1>
                <p className="text-gray-600">
                  Your work is always safe with intelligent autosave and draft features.
                </p>
              </div>
              
            </div>
          </motion.div>
          <motion.div whileHover={{scale:1.03}} transition={{duration:0.3}} style={{ backgroundImage: `url(${feat_bg})` }} className="bg-gray-100 bg-cover overflow-hidden flex justify-center items-center  relative rounded-md col-span-3 md:col-span-1 row-span-3  ">

            <div className=" px-4 flex flex-col gap-10  ">
              <div className="bg-gray-900 w-fit p-3 rounded-lg"><RiUserCommunityFill className="text-5xl text-white" /></div>
              <div className="">
                <h1 className="text-2xl font-bold text-black">
                  Global Community                </h1>
                <p className="text-gray-600">
                  Discover and connect with writers and readers around the world.

                </p>
              </div>
              
            </div>
          </motion.div>
          <motion.div whileHover={{scale:1.03}} transition={{duration:0.3}} style={{ backgroundImage: `url(${feat_bg})` }} className="bg-gray-100 bg-cover  overflow-hidden flex justify-center items-center  relative rounded-md col-span-3 md:col-span-1 row-span-3  ">

            <div className=" px-4 flex flex-col gap-10  ">
              <div className="bg-gray-900 w-fit p-3 rounded-lg"><MdPrivacyTip className="text-5xl text-white" /></div>
              <div className="">
                <h1 className="text-2xl font-bold text-black">
                  Privacy & Access Control
                </h1>
                <p className="text-gray-600">
                  You control your content — share it publicly, privately, or protect it with access settings.

                </p>
              </div>
              
            </div>
          </motion.div>
        </motion.div>
        

        {/* Newsletter Section */}
        <motion.div
          className=" max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <NewsletterSignup />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-tr from-gray-900 via-slate-700 to-gray-900 rounded-2xl p-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Writing Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of passionate writers and start sharing your
            unique perspective with the world.
          </p>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
          >
            Create Your Account
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src={logo} className="w-44" />
          </div>
          <p className="text-gray-600">© 2024 InkWave by Aman.</p>
        </div>
      </footer>
        
      </div>
      
    </div>
  );
}
