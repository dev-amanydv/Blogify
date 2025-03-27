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
            "blogCreatedTime": string
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
        "id":string,
        "title": string,
        "content": string,
        "authorId": string,
        "blogCreatedTime": string,
    }[];
}

export const useBlog = ({id}: {id: string}) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
      };

    useEffect(()=> {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization : getAuthToken()
            }
        }).then(response => {
                setBlog(response.data.blog);
                setLoading(false)
            })

    }, [id])
    return {loading,blog}

}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const getAuthToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
      };

    useEffect(()=> {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization :  getAuthToken()
            }
        }).then(response => {
                setBlogs(response.data.blogs);
                setLoading(false)
            })

    }, [])
    return {loading,blogs}
}


export const useUser = () => {
    const [user, setUser] = useState<{ name?: string; profilePic?: string }>({});;
  
    useEffect(() => {
      const storedUser = localStorage.getItem("userData") || sessionStorage.getItem("userData")
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  
    return user;
  };


  export const useAuthorProfile =  ({id}: {id:string})=> {
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
                setAuthor(response.data.userDetails);  // Adjust if necessary
            } catch (error) {
                console.error("Error fetching author:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAuthor();
    }, [id]);

    return {loading, author}
  }
  
