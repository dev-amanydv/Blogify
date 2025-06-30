import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import toast from "react-hot-toast";
import { IoAddOutline, IoFilterOutline } from "react-icons/io5";

interface MyBlog {
    id: string;
    title: string;
    content: string;
    published: boolean;
    blogCreatedTime: string;
    author: {
        name: string;
        profilePic: string;
    };
}

export default function MyBlogs() {
    const [blogs, setBlogs] = useState<MyBlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
    const navigate = useNavigate();

    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const fetchMyBlogs = async () => {
        try {
            setLoading(true);
            // This would be a new endpoint to fetch user's own blogs
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/my-blogs`, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            setBlogs(response.data.blogs || []);
        } catch (error) {
            toast.error("Failed to fetch your blogs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blogId: string) => {
        navigate(`/edit/${blogId}`);
    };

    const handleDelete = async (blogId: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            setBlogs(blogs.filter(blog => blog.id !== blogId));
            toast.success("Blog deleted successfully");
        } catch (error) {
            toast.error("Failed to delete blog");
            console.error(error);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        if (filter === 'published') return blog.published;
        if (filter === 'drafts') return !blog.published;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="animate-pulse space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Articles</h1>
                        <p className="text-gray-600">Manage your published articles and drafts</p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/publish')}
                        className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        <IoAddOutline className="w-5 h-5" />
                        <span>New Article</span>
                    </motion.button>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-4 mb-6"
                >
                    <div className="flex items-center space-x-2">
                        <IoFilterOutline className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                    </div>
                    
                    <div className="flex space-x-2">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'published', label: 'Published' },
                            { key: 'drafts', label: 'Drafts' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === key
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {blogs.filter(b => b.published).length}
                        </div>
                        <div className="text-sm text-gray-600">Published</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {blogs.filter(b => !b.published).length}
                        </div>
                        <div className="text-sm text-gray-600">Drafts</div>
                    </div>
                </motion.div>

                {/* Blogs List */}
                <div className="space-y-6">
                    {filteredBlogs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-400 mb-4">
                                <IoAddOutline className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No articles found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'all' 
                                    ? "You haven't written any articles yet."
                                    : `No ${filter} articles found.`
                                }
                            </p>
                            <button
                                onClick={() => navigate('/publish')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Write Your First Article
                            </button>
                        </motion.div>
                    ) : (
                        filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <BlogCard
                                    id={blog.id}
                                    authorName={blog.author.name}
                                    title={blog.title}
                                    content={blog.content}
                                    blogCreatedTime={blog.blogCreatedTime}
                                    profilePic={blog.author.profilePic}
                                    published={blog.published}
                                    showActions={true}
                                    onEdit={() => handleEdit(blog.id)}
                                    onDelete={() => handleDelete(blog.id)}
                                />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}