import { Appbar } from "../components/Appbar";
import { useAuthorProfile, useBlog } from "../hooks";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import  CoverPic  from "../assets/coverpic.jpeg"
interface BlogCradProps {
  id:string,
  authorName:  string,
  title: string,
  content: string,
  blogCreatedTime: string,
  
}



export default function AuthorsProfile() {

  const { id } = useParams();
  console.log("Author ID:", id);
  const { author } = useAuthorProfile({ id: id || "" });
  console.log("Author data:", author);
  const name = author?.name || "Guest";
  const profilePic = author?.profilePic;
  const shortName = name.split(" ");
  const name1 = shortName[0];
  const name2 = shortName[1];
  const nameAvatar = name.includes(" ") ? name1[0] + name2[0] : name[0];
  const lastBlogId = sessionStorage.getItem("lastBlogId");

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
      <div className="bg-gray-200 h-screen">
        <div className="h-15 flex gap-2 bg-gray-500">
          <div className="text-4xl flex items-center">
          <Link to={`/blog/${lastBlogId}`}><IoArrowBack /></Link>
          </div>
          <div className="text-2xl font-[Roboto] font-medium flex items-center">
            {author.name}

          </div>
        </div>
        <div className="flex  flex-col items-center justify-center ">
          <div>
            <img src={CoverPic} alt="" />
          </div>
          {profilePic ? (
            <img
              src={profilePic}
              alt={name}
              className=" h-70 w-70 border-3 rounded-full  object-cover "
            />
          ) : (
            <span className="font-medium flex justify-center items-center text-gray-600  h-70 w-70 text-5xl rounded-full  object-cover bg-gray-400 ">
              {nameAvatar.toUpperCase()}
            </span>
          )}{" "}
          <div className=" pt-3 text-3xl font-[Poppins] font-semibold text-gray-800">{author?.name}</div>
          <div className="text-4xl">{author?.bio}</div>
          <div>{author?.gender}</div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
