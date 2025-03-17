import { SignupInput } from "@amanhere/medium-common"
import {  useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import  axios  from "axios"
import { BACKEND_URL } from "../Config"

export const Auth = ({type}: {type: "Sign Up" | "Sign In"}) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })
    async function sendRequest(){
        try {
            console.log("Sending request");
            setLoading(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type == "Sign Up"? "signup": "signin"}`, postInputs);
            console.log(response);
            const jwt = response.data.jwt;
            console.log(jwt);
            
            localStorage.setItem("token","Bearer " + jwt);
            setLoading(false);
            navigate("/blogs");
            return loading;
        } catch (error) {
            alert("Error while signing Up!")
        }

    }
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center ">
            <div>
            <div className="px-10">
                <div className="text-3xl font-extrabold  ">
                        Create an account
                </div>
                <div className="text-slate-500">
                    <Link to={type == "Sign Up"? "/signin" : "/signup"}>{type == "Sign Up"? "Already have an account? Login!" : "Don't have an account? Sign Up"}</Link>
                </div>
            </div>
            <div className="pt-4">
                { type === "Sign Up" ? <LabelledInput label="Name" placeholder="Aman Yadav" onChange={(e) => {
                    setPostInputs(c => ({
                        ...c,
                        name: e.target.value
                    }))
                }} /> : null}
                <LabelledInput label="Email" placeholder="amanydv@gmail.com" onChange={(e) => {
                    setPostInputs(c => ({
                        ...c,
                        email: e.target.value
                    }))
                }} />
                <LabelledInput label="Password" type="password" placeholder="*******" onChange={(e) => {
                    setPostInputs(c => ({
                        ...c,
                        password: e.target.value
                    }))
                }} />
                <button onClick={sendRequest} type="button" className=" mt-6 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
                 focus:ring-4 focus:ring-gray-300  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{type == "Sign Up" ? "Sign Up": "Sign In"}</button>

            </div>

            </div>
            
            
        </div>
    </div>
} 

interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e: any) => void,
    type?: string
}

function LabelledInput ({label, placeholder, onChange, type}: LabelledInputType){
    return <div>
    <label  className="block mb-2 text-sm font-semibold text-gray-900 pt-4">{label}</label>
    <input onChange={onChange} type={ type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 
    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
</div>
}