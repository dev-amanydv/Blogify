import { useParams } from "react-router-dom";
import { useBlog } from "../hooks"
import { FullBlog } from "../components/FullBlog";
import { Appbar } from "../components/Appbar";


export const Blog = () => {
    const {id} = useParams();
    const { loading, blog } = useBlog({id : id || ""});
    if(loading || !blog){
        return <div>
     <Appbar/>

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
    }

    return <div>
        <FullBlog blog={blog}/>
    </div>
}