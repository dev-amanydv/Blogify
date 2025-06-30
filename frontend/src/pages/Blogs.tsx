import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoTrendingUpOutline, IoTimeOutline, IoFlameOutline } from "react-icons/io5";
import NewsletterSignup from "../components/NewsletterSignup";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [filter, setFilter] = useState<'latest' | 'trending' | 'popular'>('latest');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(5)].map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredBlogs = [...blogs].sort((a, b) => {
    if (filter === 'latest') {
      return new Date(b.blogCreatedTime).getTime() - new Date(a.blogCreatedTime).getTime();
    }
    return new Date(b.blogCreatedTime).getTime() - new Date(a.blogCreatedTime).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore thought-provoking articles, insights, and stories from our community of writers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-1 mb-8 bg-white rounded-lg p-1 border border-gray-200"
            >
              {[
                { key: 'latest', label: 'Latest', icon: IoTimeOutline },
                { key: 'trending', label: 'Trending', icon: IoTrendingUpOutline },
                { key: 'popular', label: 'Popular', icon: IoFlameOutline }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </motion.div>

            <div className="space-y-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    blogCreatedTime={blog.blogCreatedTime}
                    profilePic={blog.author.profilePic}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Design', 'Business', 'Health', 'Travel', 'Food'].map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Authors</h3>
              <div className="space-y-3">
                {blogs.slice(0, 6).map((blog, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={blog.author.profilePic || `https://ui-avatars.com/api/?name=${blog.author.name}&background=random`}
                      alt={blog.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{blog.author.name}</p>
                      <p className="text-sm text-gray-500">1.2k followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <NewsletterSignup />
          </div>
        </div>
      </div>
    </div>
  );
};