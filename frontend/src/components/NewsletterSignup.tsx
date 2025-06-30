import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoMailOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../Config";

interface NewsletterSignupProps {
    className?: string;
}

export default function NewsletterSignup({ className = "" }: NewsletterSignupProps) {
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setIsSubscribing(true);
            
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/newsletter`,
      email,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(response)
            
            setIsSubscribed(true);
            toast.success("Successfully subscribed to our newsletter!");
            setEmail("");
            
            // Reset success state after 3 seconds
            setTimeout(() => {
                setIsSubscribed(false);
            }, 3000);
            
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            toast.error("Failed to subscribe. Please try again.");
        } finally {
            setIsSubscribing(false);
        }
    };

    if (isSubscribed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-tr from-gray-900 via-slate-700 to-gray-900 rounded-xl p-6 text-white ${className}`}
            >
                <div className="text-center">
                    <IoCheckmarkCircleOutline className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">You're All Set!</h3>
                    <p className="text-green-100 text-sm">
                        Thank you for subscribing. You'll receive our latest articles in your inbox.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`bg-gray-200 rounded-xl p-6 text-black ${className}`}
        >
            <div className="flex items-center mb-3">
                <IoMailOutline className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-semibold">Stay Updated</h3>
            </div>
            
            <p className="text-gray-800 text-sm mb-4">
                Get the latest articles and insights delivered straight to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubscribing}
                    className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                />
                
                <button
                    type="submit"
                    disabled={isSubscribing || !email.trim()}
                    className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isSubscribing ? (
                        <>
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                            Subscribing...
                        </>
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </form>
            
            <p className="text-xs text-gray-700 mt-3 text-center">
                No spam, unsubscribe at any time
            </p>
        </motion.div>
    );
}