import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { AuthorAvatar} from "./BlogCard";
import {  format } from "date-fns";


export const FullBlog = ({ blog }: { blog: Blog }) => {
  const formattedDate = format(new Date(blog.blogCreatedTime), "d MMM yyyy");     

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid gap-10 grid-cols-12 px-6 w-full pt-12 max-w-screen-2xl">
          <div className="col-span-12 sm:col-span-8">
              <div className="text-5xl font-extrabold"> {blog.title} </div>
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
                        Random catch phrase about author to grasp the users attention
                    </div>

                    </div>
                    
                </div>
                
          </div>
        </div>
      </div>
    </div>
  );
};
