import { Appbar } from "../components/Appbar";
import { useAuthorProfile } from "../hooks";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import CoverPic from "../assets/coverpic.jpeg";
import { BlogCard } from "../components/BlogCard";

export default function AuthorsProfile() {
  const { id } = useParams();
  console.log("Author ID:", id);
  const {  author } = useAuthorProfile({ id: id || "" });  console.log("Author data:", author);
  const name = author?.name || "Guest";
  const profilePic = author?.profilePic || "";
  const bio = author?.bio || " ";
  const shortName = name.split(" ");
  const name1 = shortName[0];
  const name2 = shortName[1];
  const nameAvatar = name.includes(" ") ? name1[0] + name2[0] : name[0];
  const lastBlogId = sessionStorage.getItem("lastBlogId");
  const noOfBlogs = author?.blogs.length;

  if (!author) {
    return (
      <div>
        <Appbar />
        <div className="w-screen h-screen flex items-center justify-center ">
          <div>
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
            <span className="loading loading-ring loading-xl"></span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Appbar />
      <div className="bg-gray-100 ">
        <div className="h-15 flex gap-2 bg-gray-400">
          <div className="text-4xl flex items-center">
            <Link to={`/blog/${lastBlogId}`}>
              <IoArrowBack />
            </Link>
          </div>
          <div className="text-2xl font-[Roboto] font-medium flex items-center">
            {author.name}
          </div>
        </div>
        <div className="items-center justify-center ">
          <div>
            <img src={CoverPic} alt="" className="max-w-screen" />
          </div>
          {profilePic ? (
            <img
              src={profilePic}
              alt={name}
              className=" relative inline left-4 top-[-75px] h-40 w-40 border-3 rounded-full  object-cover  "
            />
          ) : (
            <div className="relative inline left-4 top-[-75px]">
              <span className="font-medium flex justify-center items-center text-gray-600  h-40 w-40 border-3 text-5xl rounded-full  object-cover bg-gray-400 ">
                {nameAvatar.toUpperCase()}
              </span>
            </div>
          )}{" "}
          <div className="relative left-4 top-[-65px] pt-3 text-3xl font-[Poppins] font-semibold text-gray-800">
            {author?.name}
          </div>
          <div className="relative left-4 top-[-60px] text-gray-700 text-md font-light max-w-md">
            {bio.slice(0, 140) + "..."}
          </div>
          <div className="max-w-md relative left-4 top-[-45px]">
            Rajasthan, India
          </div>
        </div>
        <div className=" max-w-md relative top-[-25px] bg-gray-400 h-25 rounded-lg mx-auto mb-2 flex justify-around items-center font-[Outfit] font-semibold text-xl">
          <div className="flex flex-col justify-center items-center">
            {noOfBlogs}
            <div>Blogs</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            24
            <div>Following</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            135K
            <div>Followers</div>
          </div>
        </div>
        <div className="border-b-4 border-gray-500 flex justify-center items-center  w-95/100 mx-auto"></div>
        <div>
          {/* <Link to={`/blog/${id}`}>
              <div className="p-4 border-b-2 border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
                  <div className="flex">
                      <div className="flex justify-center items-center">
                      <AuthorAvatar size={"small"} profilePic={profilePic} name={author.name} /> 
                      </div>
                      <div className="font-light pl-2">{author.name}</div>
                      <div className="text-[5px] text-slate-500 pl-2 flex justify-center items-center">
                          &#9679;
                      </div>
                      <div className="font-thin text-slate-500 pl-2 text-sm flex items-center ">{author.blogs.blogCreatedTime}</div>
                  </div>
                  <div className="text-xl font-semibold pt-2">
                      {author.blogs.title}
                  </div>
                  <div className="text-md font-thin ">
                      {article.slice(0,100) + "..."}
                  </div>
                  <div className="w-full text-slate-400 pt-4">
                      {timeToRead} minute(s) to read
                  </div>
              </div>
              </Link> */}
               {author.blogs.map((blog: { 
                    id: string; 
                    title: string; 
                    content: string; 
                    blogCreatedTime: string; 
                }) => (
                          <BlogCard
                            id={blog.id}
                            authorName={name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            blogCreatedTime={blog.blogCreatedTime}
                            profilePic={profilePic}
                          />
                        ))}
              
        </div>
      </div>
    </div>
  );
}
