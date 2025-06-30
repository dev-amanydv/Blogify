import { Link } from "react-router-dom";
import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { AuthorAvatar} from "./BlogCard";
import {  format } from "date-fns";
import { useEffect} from "react";
import { IoArrowBack } from "react-icons/io5";


export const FullBlog = ({ blog }: { blog: Blog }) => {
  const formattedDate = format(new Date(blog.blogCreatedTime), "d MMM yyyy");     
  console.log("author id is :",blog.author.id);
  useEffect(()=>{
    if (blog.id) {
      sessionStorage.setItem("lastBlogId", blog.id);
    }
  },[])
  return (
    <div>
      <Appbar />
      <div className="text-4xl flex ml-3 md:ml-24 mt-5 text-gray-600 items-center">
                    <Link to={`/blogs`}>
                      <IoArrowBack />
                    </Link>
                  </div>
      <div className="flex justify-center">
 
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 w-full pt-8 sm:pt-12 max-w-screen-xl">
          <div className="col-span-12 max-w-sm md:max-w-4xl sm:col-span-8">
              <div className="text-3xl md:text-5xl font-extrabold"> {blog.title} </div>
              <div className="text-slate-500 pt-2">Posted on {formattedDate}</div>
              <div className="text-md font-light pt-5">{blog.content}</div>
          </div>

          <div className="col-span-12 mt-4 sm:col-span-4 md:mt-6 ">
                <div className="text-slate-700 text-lg font-bold">
                Author 
                </div>
                <div className="flex flex-row sm:flex-row w-full items-center sm:items-start">
                    <div className="pr-4 inline-block  ">
                        <AuthorAvatar size={"big"} profilePic={blog.author.profilePic} name={blog.author.name || "Anonymous"}/>
                    </div>

                    <div>
                    <div className="text-xl font-bold ">
                        {blog.author.name || "Anonymous"}
                    </div>
                    <div className="pt-2 text-slate-500">
                        {blog.author.bio}
                    </div>

                    </div>
                    
                </div>
                
          </div>
        </div>
      </div>
    </div>
  );
};
