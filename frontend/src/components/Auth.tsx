import { SignupInput } from "@amanhere/medium-common"
import {  useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import  axios  from "axios"
import { BACKEND_URL } from "../Config"
import { Gender } from "./Gender"
import Checkbox from '@mui/material/Checkbox';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Auth = ({type}: {type: "Sign Up" | "Sign In"}) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
        gender: ""
    })
async function sendRequest() {
  try {
    console.log("Sending request");
    setLoading(true);
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/${type === "Sign Up" ? "signup" : "signin"}`,
      postInputs,
      { headers: { "Content-Type": "application/json" } }
    );

    const jwt = response.data.jwt;
    const userData = response.data.userData;

    if (rememberMe) {
      localStorage.setItem("token", "Bearer " + jwt);
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("token", "Bearer " + jwt);
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }

    setLoading(false);
    navigate("/blogs");
  } catch (error) {
    const err = error as any;
    setError(err?.response?.data?.error || err?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
}
    console.log(rememberMe)

    function handleRememberMe(){
        {rememberMe == true ? setRememberMe(false) : setRememberMe(true)}
        console.log(rememberMe)

    }
    return <div className="h-screen flex justify-center flex-col px-4">
        <div className="flex justify-center ">
            <div>
            <div className="px-10">
                <div className="text-3xl font-semibold text-center ">
                        {type == "Sign In" ? "Welcome Back!" : "Get Started with InkWave!"}
                </div>
                <div className="text-slate-500 text-center">
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
                {type == "Sign Up"? <Gender onGenderChange={(gender) => {
                    setPostInputs(c => ({
                        ...c,
                        gender: gender
                    }));
                }}/> : ""}
                
                <div>
                    <Checkbox checked={rememberMe} onClick={handleRememberMe} {...label} />
                        Remember Me
                </div>
{error && <div className="text-sm text-red-600 mt-2">{error}</div>}                <button disabled={loading} onClick={sendRequest} type="button" className=" mt-6 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
                 focus:ring-4 focus:ring-gray-300  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{loading ? (type == "Sign Up" ? "Signing Up..." : "Signing In...") : (type == "Sign Up" ? "Sign Up" : "Sign In")} </button>

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