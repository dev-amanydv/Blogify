import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import toast from "react-hot-toast";
import { IoSaveOutline, IoSendOutline } from "react-icons/io5";

export default function Publish() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const navigate = useNavigate();

    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        const autoSave = setTimeout(() => {
            if ((title.trim() || content.trim()) && !saving) {
                handleSaveDraft(true); 
            }
        }, 10000); 

        return () => clearTimeout(autoSave);
    }, [title, content]);

    const handleSaveDraft = async (silent = false) => {
        if (!title.trim() && !content.trim()) {
            if (!silent) {
                toast.error("Nothing to save yet");
            }
            return;
        }

        const token = getAuthToken();
        if (!token) {
            toast.error("Please log in to save drafts");
            navigate('/signin');
            return;
        }

        try {
            setSaving(true);
            
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/draft`, {
                title: title || "Untitled Draft",
                content: content || "",
            }, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            });
            
            setLastSaved(new Date());
            
            if (!silent) {
                toast.success("Draft saved successfully");
            }
            
            console.log("Draft saved:", response.data);
        } catch (error: any) {
            console.error("Error saving draft:", error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                navigate('/signin');
            } else if (error.response?.data?.error) {
                if (!silent) {
                    toast.error(error.response.data.error);
                }
            } else {
                if (!silent) {
                    toast.error("Failed to save draft. Please try again.");
                }
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill in both title and content");
            return;
        }

        const token = getAuthToken();
        if (!token) {
            toast.error("Please log in to publish");
            navigate('/signin');
            return;
        }

        try {
            setPublishing(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title,
                content,
                published: true
            }, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            });
            
            toast.success("Article published successfully!");
            navigate(`/blog/${response.data.id}`);
        } catch (error: any) {
            console.error("Error publishing:", error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                navigate('/signin');
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to publish article. Please try again.");
            }
        } finally {
            setPublishing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5 sm:flex-row items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Write New Article</h1>
                        {lastSaved && (
                            <p className="text-sm text-gray-500 mt-1">
                                Last saved: {lastSaved.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        
                        <button
                            onClick={() => handleSaveDraft(false)}
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
                            <IoSendOutline className="w-4 h-4" />
                            <span>{publishing ? 'Publishing...' : 'Publish'}</span>
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

                {/* Writing Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200"
                >
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Writing Tips</h3>
                    <ul className="space-y-2 text-blue-800">
                        <li>• Start with a compelling headline that grabs attention</li>
                        <li>• Use short paragraphs and bullet points for better readability</li>
                        <li>• Include relevant examples and stories to engage readers</li>
                        <li>• End with a clear call-to-action or conclusion</li>
                    </ul>
                </motion.div>

                {/* Auto-save indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-center"
                >
                    <p className="text-sm text-gray-500">
                        {saving ? "Saving..." : "Changes are automatically saved every 10 seconds"}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}