import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { motion } from "framer-motion";
import { 
    IoDocumentTextOutline, 
    IoEyeOutline, 
    IoHeartOutline, 
    IoTrendingUpOutline,
    IoCalendarOutline,
    IoStatsChartOutline
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useUser } from "../hooks";

interface DashboardStats {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    drafts: number;
}

export default function Dashboard() {
    const user = useUser();
    const [stats, setStats] = useState<DashboardStats>({
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        drafts: 0
    });

    useEffect(() => {
        // Simulate fetching dashboard stats
        setStats({
            totalBlogs: 12,
            totalViews: 2847,
            totalLikes: 156,
            drafts: 3
        });
    }, []);

    const statCards = [
        {
            title: "Total Articles",
            value: stats.totalBlogs,
            icon: IoDocumentTextOutline,
            color: "from-blue-500 to-blue-600",
            change: "+2 this month"
        },
        {
            title: "Total Views",
            value: stats.totalViews.toLocaleString(),
            icon: IoEyeOutline,
            color: "from-green-500 to-green-600",
            change: "+12% this month"
        },
        {
            title: "Total Likes",
            value: stats.totalLikes,
            icon: IoHeartOutline,
            color: "from-red-500 to-red-600",
            change: "+8% this month"
        },
        {
            title: "Drafts",
            value: stats.drafts,
            icon: IoDocumentTextOutline,
            color: "from-yellow-500 to-yellow-600",
            change: "3 pending"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.name || 'Writer'}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your blog today.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <IoTrendingUpOutline className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                            <p className="text-xs text-green-600">{stat.change}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <IoStatsChartOutline className="w-5 h-5 mr-2" />
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        New article published
                                    </p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Draft saved
                                    </p>
                                    <p className="text-xs text-gray-500">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Profile updated
                                    </p>
                                    <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <IoCalendarOutline className="w-5 h-5 mr-2" />
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <Link
                                to="/publish"
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                <span className="font-medium">Write New Article</span>
                                <IoDocumentTextOutline className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/drafts"
                                className="flex items-center justify-between p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <span className="font-medium">Continue Draft</span>
                                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    {stats.drafts}
                                </span>
                            </Link>
                            <Link
                                to="/my-blogs"
                                className="flex items-center justify-between p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <span className="font-medium">Manage Articles</span>
                                <IoStatsChartOutline className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Performance Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Performance Overview
                    </h2>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <IoStatsChartOutline className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Analytics chart coming soon</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}