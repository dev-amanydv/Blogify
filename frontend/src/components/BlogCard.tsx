import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "../hooks";
import { motion } from "framer-motion";
import { IoTimeOutline, IoEyeOutline } from "react-icons/io5";

interface BlogCardProps {
    id: string,
    authorName: string,
    title: string,
    content: string,
    blogCreatedTime: string,
    profilePic: string,
    showActions?: boolean,
    onEdit?: () => void,
    onDelete?: () => void,
    published?: boolean
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    blogCreatedTime,
    profilePic,
    showActions = false,
    onEdit,
    onDelete,
    published = true
}: BlogCardProps) => {
    const split = content.split(" ");
    const totalWords = split.length;
    const timeToRead = Math.max(1, Math.ceil(totalWords / 125));
    const formattedDate = format(new Date(blogCreatedTime), "MMM d, yyyy");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
            <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <AuthorAvatar size="small" profilePic={profilePic} name={authorName} />
                        <div>
                            <p className="font-medium text-gray-900">{authorName}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{formattedDate}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                    <IoTimeOutline className="w-3 h-3" />
                                    <span>{timeToRead} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {!published && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Draft
                        </span>
                    )}
                </div>

                {/* Content */}
                <Link to={`/blog/${id}`} className="block">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                        {content.slice(0, 150)}...
                    </p>
                </Link>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <IoEyeOutline className="w-4 h-4" />
                            <span>1.2k views</span>
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={onEdit}
                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export function AuthorAvatar({ name, profilePic, size = "small" }: { name: string, profilePic?: string, size?: "small" | "big" }) {
    const shortName = name.split(" ");
    const name1 = shortName[0];
    const name2 = shortName[1];
    const nameAvatar = name.includes(" ") ? name1[0] + name2[0] : name[0];
    
    const sizeClasses = size === "small" ? "h-8 w-8 text-sm" : "h-12 w-12 text-lg";

    return (
        <div className={`relative inline-flex items-center justify-center ${sizeClasses} overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ring-2 ring-white`}>
            {profilePic ? (
                <img src={profilePic} alt={name} className="h-full w-full object-cover" />
            ) : (
                <span className="font-semibold text-white">
                    {nameAvatar.toUpperCase()}
                </span>
            )}
        </div>
    );
}

export function Avatar() {
    const user = useUser();
    const name = user.name || "Guest";
    const profilePic = user.profilePic;
    const shortName = name.split(" ");
    const name1 = shortName[0];
    const name2 = shortName[1];
    const nameAvatar = name.includes(" ") ? name1[0] + name2[0] : name[0];

    return (
        <div className="relative inline-flex items-center justify-center h-10 w-10 overflow-hidden bg-gray-600 rounded-full ring-2 ring-white">
            {profilePic ? (
                <img src={profilePic} alt={name} className="h-full w-full object-cover" />
            ) : (
                <span className="font-semibold text-white text-sm">
                    {nameAvatar.toUpperCase()}
                </span>
            )}
        </div>
    );
}