import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import toast from "react-hot-toast";
import { IoSaveOutline, IoEyeOutline, IoArrowBackOutline } from "react-icons/io5";

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            const blog = response.data.blog;
            setTitle(blog.title);
            setContent(blog.content);
        } catch (error) {
            toast.error("Failed to fetch blog");
            navigate('/my-blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setSaving(true);
            await axios.put(`${BACKEND_URL}/api/v1/blog/draft/${id}`, {
                title,
                content
            }, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            toast.success("Draft saved successfully");
        } catch (error) {
            toast.error("Failed to save draft");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill in both title and content");
            return;
        }

        try {
            setPublishing(true);
            await axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, {
                title,
                content,
                published: true
            }, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            toast.success("Blog updated and published successfully");
            navigate(`/blog/${id}`);
        } catch (error) {
            toast.error("Failed to publish blog");
        } finally {
            setPublishing(false);
        }
    };

    const handlePreview = () => {
        // Save current state to localStorage for preview
        localStorage.setItem('previewBlog', JSON.stringify({ title, content }));
        window.open(`/blog/${id}?preview=true`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="h-12 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
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
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/my-blogs')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <IoArrowBackOutline className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePreview}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <IoEyeOutline className="w-4 h-4" />
                            <span>Preview</span>
                        </button>
                        
                        <button
                            onClick={handleSaveDraft}
                            disabled={saving}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <IoSaveOutline className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                        </button>
                        
                        <button
                            onClick={handlePublish}
                            disabled={publishing || !title.trim() || !content.trim()}
                            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            <span>{publishing ? 'Publishing...' : 'Update & Publish'}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    {/* Title Input */}
                    <div className="p-6 border-b border-gray-200">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article title..."
                            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none"
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="p-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell your story..."
                            rows={20}
                            className="w-full text-lg text-gray-700 placeholder-gray-400 border-none outline-none resize-none leading-relaxed"
                        />
                    </div>
                </motion.div>

                {/* Auto-save indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-center"
                >
                    <p className="text-sm text-gray-500">
                        Changes are automatically saved as you type
                    </p>
                </motion.div>
            </div>
        </div>
    );
}