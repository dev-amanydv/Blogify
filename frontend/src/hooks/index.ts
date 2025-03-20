import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../Config";

export interface Blog {
            "content": string,
            "title": string,
            "id": string,
            "author": {
                "name": string,
                "profilePic": string
            },
            "blogCreatedTime": string
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
  
