import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./BlogCard"
import { IoCreateOutline } from "react-icons/io5";
import { useState } from "react";

export const Appbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    return <div className="border-b-2 border-slate-300 flex justify-between px-10 py-4">
        <Link to={"/blogs"} className="flex font-bold text-2xl items-center justify-center cursor-pointer">
                Blogify
        </Link>
        
        <div className="flex">
            <Link to={"/publish"}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 flex justify-center items-center gap-1 "><IoCreateOutline className="text-xl" />Create</button>
            </Link>
            <button onClick={()=> {setOpen(true)}}><Avatar /></button>
            {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
          <ul className="text-gray-800">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/settings">Settings</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/my-blogs">My Blogs</Link>
            </li>
            <li
              className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
              onClick={() => {localStorage.removeItem("token");
                localStorage.removeItem("userData");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userData");
                navigate('/')
              }
              }
            >
              Logout
            </li>
          </ul>
        </div>
      )}

        </div>

    </div>
}