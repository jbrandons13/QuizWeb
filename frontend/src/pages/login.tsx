import { useNavigate } from "react-router-dom";
import LoginForm from "../components/login-form";
import Background from "../components/backgroundeffect";

export default function Login(): JSX.Element {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col justify-center items-center w-full h-screen bg-[#303C6C] relative">
            <Background color="EDEFF7"/>
            <button onClick={()=>{navigate('/')}} className="absolute top-0 text-md w-11/12 h-[50px] font-bold text-center bg-[#FAFAFA] text-[#303C6C] rounded-b-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-white hover:text-xl hover:h-[80px]">Play a Game</button>
            <div className="w-full flex justify-center items-center">
                <LoginForm/>
            </div>
        </main> 
    )
}