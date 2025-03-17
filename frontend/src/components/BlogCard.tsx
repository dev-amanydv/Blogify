import { Link } from "react-router-dom";

interface BlogCradProps {
    id:string,
    authorName:  string,
    title: string,
    content: string,
    publishedDate: string
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCradProps) => {

    const split = content.split(" ");
    const totalWords = split.length;
    console.log(totalWords);
     
    return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b-2 border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
        <div className="flex">
            <div className="flex justify-center items-center">
            <Avatar size={"small"} name={authorName} /> 
            </div>
            <div className="font-light pl-2">{authorName}</div>
            <div className="text-[5px] text-slate-500 pl-2 flex justify-center items-center">
                &#9679;
            </div>
            <div className="font-thin text-slate-500 pl-2 text-sm flex items-center ">{publishedDate}</div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin ">
            {content.slice(0,100) + "..."}
        </div>
        <div className="w-full text-slate-400 pt-4">
            {`${Math.ceil(totalWords / 125)} minute(s) to read`}
        </div>
    </div>
    </Link>
    
}

 export function Avatar ({name,size="small" }: {name:string, size?: "small" | "big"}){

    const shortName = name.split(" ");
    const name1 = shortName[0];
    const name2 = shortName[1];
    return <div className={`relative inline-flex items-center justify-center ${size == "small"? "h-7 w-7": "h-10 w-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
    <span className="font-medium text-xs text-gray-600 dark:text-gray-300">{ name.includes(" ")? name1[0] + name2[0] : name[0]}</span>
</div>
}