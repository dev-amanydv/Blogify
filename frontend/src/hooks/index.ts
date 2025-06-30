import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../Config";

export interface Blog {
    "content": string,
    "title": string,
    "id": string,
    "author": {
        "name": string,
        "profilePic": string,
        "bio": string,
        "id": string
    },
    "blogCreatedTime": string,
    "published"?: boolean
}

export interface Author {
    "name": string,
    "email": string,
    "id": string,
    "gender": string,
    "userCreatedTime": string,
    "bio": string,
    "profilePic": string,
    "blogs": {
        "id": string,
        "title": string,
        "content": string,
        "authorId": string,
        "blogCreatedTime": string,
        "published": boolean
    }[];
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: getAuthToken()
            }
        }).then(response => {
            setBlog(response.data.blog);
            setLoading(false)
        }).catch(error => {
            console.error("Error fetching blog:", error);
            setLoading(false);
        })

    }, [id])
    return { loading, blog }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: getAuthToken()
            }
        }).then(response => {
            setBlogs(response.data.blogs);
            setLoading(false)
        }).catch(error => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        })

    }, [])
    return { loading, blogs }
}

export const useSearch = () => {
    const [searchResults, setSearchResults] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    const searchBlogs = async (query: string) => {
        if (!query.trim() || query.trim().length < 2) {
            setSearchResults([]);
            setSearchQuery("");
            return;
        }

        try {
            setLoading(true);
            setSearchQuery(query);
            
            console.log("🔍 Searching for:", query);
            console.log("🔑 Auth token:", getAuthToken() ? "Present" : "Missing");
            console.log("🌐 Backend URL:", BACKEND_URL);
            
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/search`, {
                params: { q: query },
                headers: {
                    Authorization: getAuthToken(),
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });
            
            console.log("✅ Search response:", response.data);
            console.log("📊 Results count:", response.data.blogs?.length || 0);
            
            setSearchResults(response.data.blogs || []);
        } catch (error: any) {
            console.error("❌ Error searching blogs:", error);
            console.error("📋 Error details:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("🔐 Authentication error detected");
                setSearchResults([]);
            } else if (error.code === 'ECONNABORTED') {
                console.log("⏰ Request timeout");
                setSearchResults([]);
            } else {
                console.log("🔧 General error, clearing results");
                setSearchResults([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSearchQuery("");
        setLoading(false);
    };

    return { searchResults, loading, searchQuery, searchBlogs, clearSearch };
};

export const useUser = () => {
    const [user, setUser] = useState<{ name?: string; profilePic?: string; email?: string }>({});

    useEffect(() => {
        const storedUser = localStorage.getItem("userData") || sessionStorage.getItem("userData")
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return user;
};

export const useAuthorProfile = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(false)
    const [author, setAuthor] = useState<Author>();
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        const fetchAuthor = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/${id}`, {
                    headers: { Authorization: getAuthToken() }
                });
                console.log("API Response:", response.data);
                setAuthor(response.data.userDetails);
            } catch (error) {
                console.error("Error fetching author:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [id]);

    return { loading, author }
}

export const useMyBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        // This would be a new endpoint to fetch user's own blogs
        axios.get(`${BACKEND_URL}/api/v1/user/my-blogs`, {
            headers: {
                Authorization: getAuthToken()
            }
        }).then(response => {
            setBlogs(response.data.blogs || []);
            setLoading(false)
        }).catch(error => {
            console.error("Error fetching my blogs:", error);
            setLoading(false);
        })

    }, [])
    return { loading, blogs, setBlogs }
}

export const useDrafts = () => {
    const [loading, setLoading] = useState(true);
    const [drafts, setDrafts] = useState<Blog[]>([]);
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/drafts`, {
            headers: {
                Authorization: getAuthToken()
            }
        }).then(response => {
            setDrafts(response.data.drafts || []);
            setLoading(false)
        }).catch(error => {
            console.error("Error fetching drafts:", error);
            setLoading(false);
        })

    }, [])
    return { loading, drafts, setDrafts }
}