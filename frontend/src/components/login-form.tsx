import axios from "axios";
import { useEffect, useState } from "react";
import { RiLock2Fill, RiUser3Fill } from "react-icons/ri";
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";
import LoadingAnimationScreen from "./loadinganimation";

export default function LoginForm(): JSX.Element {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [start, setStart] = useState(false);
    useEffect(()=>{
        Cookie.remove('token');
        localStorage.removeItem("username");
    },[]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setPassword(e.target.value);
    }

    const [flag, setFlag] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setFlag(false);
        try {
            const response = await axios.post(API_URL+'/creator/signin', {username,password},{headers:{"ngrok-skip-browser-warning": "69420"}})
            console.log('Login successful', response.data);
            if (!response.data.success) {
                return alert("Something went wrong. Try again.");
            }
            const date = new Date(response.data.expireIn).getTime();
            Cookie.set('token', response.data.accessToken, {expires:response.data.expireIn/(60 * 60 * 24)});
            localStorage.setItem("username", username);
            setStart(true);
            setTimeout(() => {
                setStart(false);
                navigate('/home');
            }, 300);
            
        } catch (error:any) {   
            setFlag(true);
            setErrorText(error.response.data.error);
            console.error('Login error', error.response.data.error);
        }
    }

    return (
        <>
        <div className=" max-[550px]:w-11/12 min-[550px]:px-32 pt-16 pb-4 bg-[#FAFAFA] drop-shadow-xl">
            <form action="" onSubmit={handleSubmit} className=" flex flex-col items-center">
                <h2 className=" text-center max-[550px]:text-2xl min-[550px]:text-3xl max-[550px]:mb-5 min-[550px]:mb-10">Account Sign In</h2>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="flex items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl ">
                        <label htmlFor="username"><RiUser3Fill/></label>
                        <input 
                        required
                        type="text" 
                        name="username" 
                        id="username" 
                        placeholder="Username" 
                        onChange = {handleUsernameChange}
                        className="p-1.5 bg-[#FAFAFA] border-b-2" />
                    </div>
                    <div className="flex items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl">
                        <label htmlFor="password"><RiLock2Fill/></label>
                        <input 
                        required
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Password" 
                        onChange={handlePasswordChange}
                        className="p-1.5 bg-[#FAFAFA] border-b-2" />
                    </div>
                    <div className="h-[20px] my-1 text-red-500 text-xs text-center">{flag ? `${errorText}`:''}</div>
                </div>
                <button type="submit" className="text-md w-32 h-12 mb-10 text-center rounded-sm bg-[#303C6C] text-[#FAFAFA] font-bold shadow-md transition-all duration-200 hover:bg-[#263157] active:shadow-inner ">Sign In</button>
                <p>Don't have an account? <a href="/signup" className=" font-semibold hover:underline">Sign Up</a></p>
            </form>
        </div>
        {start && (<LoadingAnimationScreen/>)}
        </>
    )
}