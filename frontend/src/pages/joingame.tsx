import { RiLoginBoxLine } from "react-icons/ri";
import JoinGameForm from "../components/joingame-form";
import { useNavigate, useParams } from "react-router-dom";
import { startTransition, useEffect } from "react";
import Cookie from "js-cookie";
import Background from "../components/backgroundeffect";
import Information from "../components/information";
import { TurnOffAllSound } from "../musics/soundmanager";
export default function JoinGame():JSX.Element{
    const {gamecode} = useParams();
    if(gamecode){
        console.log("this is the link from creator", gamecode);
    }
    useEffect(()=>{
        TurnOffAllSound();
        localStorage.removeItem('userdata');
        localStorage.removeItem('isRefreshed');
        localStorage.removeItem('gametype');
        localStorage.removeItem('volume'); 
        localStorage.removeItem('totalplayer');
        localStorage.removeItem('playercount');
        localStorage.removeItem('username');
        localStorage.removeItem('gamestatus');
        Cookie.remove('token');
    },[]);
    const navigate = useNavigate();
    const handleNavigation = (path:string) => {
        startTransition(() => {
          navigate(path);
        });
      };
    return(
        <div className="w-full h-screen bg-[#EDEFF7] flex justify-center item-center relative">
            <Background color='303C6C'/>
            <Information/>
            <button onClick={()=>{handleNavigation('/signin')}} className="absolute top-0 text-md w-11/12 h-[50px] font-bold text-center bg-[#303C6C] text-[#FAFAFA] rounded-b-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-white hover:text-[#303C6C] hover:text-xl hover:h-[80px]">Create Games (Account Sign In)</button>
            <div className="w-full flex justify-center max-[550px]:items-start max-[550px]:mt-[90px] min-[550px]:items-center">
                <JoinGameForm gamecode={gamecode}/>
            </div>
            
        </div>
        
    )
}