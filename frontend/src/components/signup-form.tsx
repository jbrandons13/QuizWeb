import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/config";
import { RiLock2Fill, RiMailFill, RiUser3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SignUpForm():JSX.Element{
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [flag, setFlag] = useState(false);
    const [errorText, setErrorText] = useState('');
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.target.value);
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setPassword(e.target.value);
    }
    const handleConfirmPasswordChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if(password !== confirmPassword){
            setErrorText("Passwords do not match");
            setFlag(true);
            return;
        }

        setFlag(false);

        try {
            const response = await axios.post(API_URL+'/creator/signup', {username,email,password},{headers:{"ngrok-skip-browser-warning": "69420"}})
            if(response.data.text !== 'success'){
                setErrorText(response.data.text);
                setFlag(true);
                return;
            }else{
                navigate('/signin');
            }
        } catch (error) {
            console.error('Sign Up error', error);
        }
    }

    return (
        <div className="max-[550px]:w-11/12 min-[550px]:px-32 pt-16 pb-4 bg-[#FAFAFA] drop-shadow-xl">
            <form action="" onSubmit={handleSubmit} className=" flex flex-col items-center">

                <h2 className=" text-center max-[550px]:text-2xl min-[550px]:text-3xl max-[550px]:mb-5 min-[550px]:mb-10">Account Sign Up</h2>

                <div className="flex flex-col gap-2 mb-2 ">
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
                    <div className="flex items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl ">
                        <label htmlFor="email"><RiMailFill/></label>
                        <input 
                        required
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Email" 
                        onChange = {handleEmailChange}
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
                    <div className="flex items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl">
                        <label htmlFor="confirmPassword"><RiLock2Fill/></label>
                        <input 
                        required
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        placeholder="Confirm Password" 
                        onChange={handleConfirmPasswordChange}
                        className="p-1.5 bg-[#FAFAFA] border-b-2" />
                    </div>
                    <div className="h-[10px] text-red-500 text-xs text-center">{flag ? `${errorText}`:''}</div>
                </div>
                <button type="submit" className=" mb-10 mt-2 text-md w-32 h-12 text-center bg-[#303C6C] text-[#FAFAFA] font-bold shadow-md transition-all duration-200 hover:bg-[#263157] active:shadow-inner">Sign Up</button>
                <p>Already have an account? <a href="/signin" className=" font-semibold hover:underline">Sign In</a></p>
            </form>
        </div>
    )
}