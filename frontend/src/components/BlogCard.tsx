import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "../hooks";

interface BlogCradProps {
    id:string,
    authorName:  string,
    title: string,
    content: string,
    blogCreatedTime: string,
    profilePic: string
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    blogCreatedTime,
    profilePic
}: BlogCradProps) => {

    const split = content.split(" ");
    const totalWords = split.length;
    const timeToRead = Number(totalWords/125).toFixed(2);
    const formattedDate = format(new Date(blogCreatedTime), "d MMM yyyy");     
    return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b-2 border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
        <div className="flex">
            <div className="flex justify-center items-center">
            <AuthorAvatar size={"small"} profilePic={profilePic} name={authorName} /> 
            </div>
            <div className="font-light pl-2">{authorName}</div>
            <div className="text-[5px] text-slate-500 pl-2 flex justify-center items-center">
                &#9679;
            </div>
            <div className="font-thin text-slate-500 pl-2 text-sm flex items-center ">{formattedDate}</div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin ">
            {content.slice(0,100) + "..."}
        </div>
        <div className="w-full text-slate-400 pt-4">
            {timeToRead} minute(s) to read
        </div>
    </div>
    </Link>
    
}

 export function AuthorAvatar ({name,profilePic,size="small" }: {name:string,profilePic?:string, size?: "small" | "big"}){

    const shortName = name.split(" ");
    const name1 = shortName[0];
    const name2 = shortName[1];
    const nameAvatar =  name.includes(" ")? name1[0] + name2[0] : name[0];
    return <div className={`relative inline-flex items-center justify-center ${size == "small"? "h-7 w-7": "h-10 w-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
   {profilePic ? (
        <img src={profilePic} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-xs text-gray-600 dark:text-gray-300">
          {nameAvatar.toUpperCase()}
        </span>
      )}
</div>
}
export function Avatar (){
    const user = useUser()
    const name = user.name || "Guest";
    const profilePic = user.profilePic
    const shortName = name.split(" ");
    const name1 = shortName[0];
    const name2 = shortName[1];
    const nameAvatar =  name.includes(" ")? name1[0] + name2[0] : name[0]

    return <div className={`relative inline-flex items-center justify-center h-10 w-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
     {profilePic ? (
        <img  src={profilePic} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-xs text-gray-600 dark:text-gray-300">
          {nameAvatar.toUpperCase()}
        </span>
      )}
</div>
}