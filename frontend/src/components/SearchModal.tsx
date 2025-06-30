import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoCloseOutline, IoTimeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AuthorAvatar } from "./BlogCard";
import { format } from "date-fns";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogs: any[]; // Or replace 'any' with the actual Blog type if available
}

export default function SearchModal({ isOpen, onClose, blogs }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (query.trim().length >= 2) {
                setLoading(true);
                const q = query.toLowerCase();
                const results = blogs.filter(blog =>
                    blog.title.toLowerCase().includes(q) ||
                    blog.content.toLowerCase().includes(q) ||
                    blog.author?.name?.toLowerCase().includes(q)
                );
                setSearchResults(results);
                setLoading(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [query, blogs]);

    const handleClose = () => {
        setQuery("");
        setSearchResults([]);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Already handled by useEffect
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-20 left-10 md:left-1/3 transform -translate-x-1/2  w-full max-w-md md:max-w-lg lg:max-w-2xl "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} className="flex items-center p-4 border-b border-gray-200">
                                <IoSearchOutline className="w-5 h-5 text-gray-400 mr-3" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search articles, authors, topics... (min 2 characters)"
                                    className="flex-1 text-lg outline-none placeholder-gray-400"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery("");
                                            setSearchResults([]);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2"
                                    >
                                        <IoCloseOutline className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                                <button
                                    onClick={handleClose}
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <IoCloseOutline className="w-5 h-5 text-gray-400" />
                                </button>
                            </form>

                            {/* Search Results */}
                            <div className="max-h-96 overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                        <p className="text-gray-500">Searching...</p>
                                    </div>
                                ) : query.trim().length > 0 && query.trim().length < 2 ? (
                                    <div className="p-8 text-center">
                                        <IoSearchOutline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-1">Keep typing...</p>
                                        <p className="text-sm text-gray-400">
                                            Enter at least 2 characters to search
                                        </p>
                                    </div>
                                ) : query.trim().length >= 2 && searchResults.length === 0 && !loading ? (
                                    <div className="p-8 text-center">
                                        <IoSearchOutline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-1">No results found</p>
                                        <p className="text-sm text-gray-400">
                                            Try searching with different keywords
                                        </p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="py-2">
                                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
                                            </p>
                                        </div>
                                        {searchResults.map((blog, index) => (
                                            <Link
                                                key={blog.id}
                                                to={`/blog/${blog.id}`}
                                                onClick={handleClose}
                                                className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-start space-x-3"
                                                >
                                                    <AuthorAvatar 
                                                        name={blog.author.name || "Anonymous"} 
                                                        profilePic={blog.author.profilePic}
                                                        size="small"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                                                            {blog.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                            {blog.content.slice(0, 120)}...
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                            <span>{blog.author.name || "Anonymous"}</span>
                                                            <span>•</span>
                                                            <div className="flex items-center space-x-1">
                                                                <IoTimeOutline className="w-3 h-3" />
                                                                <span>
                                                                    {format(new Date(blog.blogCreatedTime), "MMM d")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <IoSearchOutline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-1">Start typing to search</p>
                                        <p className="text-sm text-gray-400">
                                            Find articles, authors, and topics
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Search Tips */}
                            {!query.trim() && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p className="text-center">
                                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                                            {" "}to close • {" "}
                                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                                            {" "}to search
                                        </p>
                                        <p className="text-center">
                                            Try searching for: "technology", "design", "business"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}