import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import toast from "react-hot-toast";
import { IoDocumentTextOutline, IoTimeOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { format } from "date-fns";

interface Draft {
    id: string;
    title: string;
    content: string;
    blogCreatedTime: string;
    lastModified: string;
}

export default function Drafts() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            setLoading(true);
            // This would be a new endpoint to fetch user's drafts
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/drafts`, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            setDrafts(response.data.drafts || []);
        } catch (error) {
            toast.error("Failed to fetch drafts");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueWriting = (draftId: string) => {
        navigate(`/edit/${draftId}`);
    };

    const handleDeleteDraft = async (draftId: string) => {
        if (!confirm("Are you sure you want to delete this draft?")) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/draft/${draftId}`, {
                headers: {
                    Authorization: getAuthToken()
                }
            });
            setDrafts(drafts.filter(draft => draft.id !== draftId));
            toast.success("Draft deleted successfully");
        } catch (error) {
            toast.error("Failed to delete draft");
            console.error(error);
        }
    };

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Drafts</h1>
                        <p className="text-gray-600">Continue working on your unpublished articles</p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/publish')}
                        className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        <IoCreateOutline className="w-5 h-5" />
                        <span>New Draft</span>
                    </motion.button>
                </motion.div>

                {/* Drafts List */}
                <div className="space-y-4">
                    {drafts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-400 mb-4">
                                <IoDocumentTextOutline className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No drafts found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You don't have any saved drafts yet.
                            </p>
                            <button
                                onClick={() => navigate('/publish')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Start Writing
                            </button>
                        </motion.div>
                    ) : (
                        drafts.map((draft, index) => (
                            <motion.div
                                key={draft.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                    Draft
                                                </span>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <IoTimeOutline className="w-4 h-4 mr-1" />
                                                    Last edited {format(new Date(draft.lastModified || draft.blogCreatedTime), "MMM d, yyyy")}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {draft.title || "Untitled Draft"}
                                            </h3>
                                            
                                            <p className="text-gray-600 line-clamp-3 mb-4">
                                                {draft.content ? 
                                                    draft.content.slice(0, 200) + "..." : 
                                                    "No content yet..."
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            {draft.content ? 
                                                `${draft.content.split(' ').length} words` : 
                                                "0 words"
                                            }
                                        </div>
                                        
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleDeleteDraft(draft.id)}
                                                className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <IoTrashOutline className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => handleContinueWriting(draft.id)}
                                                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <IoCreateOutline className="w-4 h-4" />
                                                <span>Continue Writing</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}