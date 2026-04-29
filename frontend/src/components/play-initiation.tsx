import { bouncy } from "ldrs";
import { useNavigate } from "react-router-dom";
import { startTransition } from "react";

interface Props {
    forcestart : ()=> void;
    tag:string;
    current:string;
    total:string
}

bouncy.register();

export default function InitialPage({forcestart, tag,current,total}:Props):JSX.Element{
    const isRefreshed = localStorage.getItem('isRefreshed');
    const navigate = useNavigate();
    const handleExit = async () => {  
        if(document.fullscreenElement) {
          document.exitFullscreen().then(() => {}).catch((error) => {
          console.error('Error exiting fullscreen:', error);
          });
        }
        // anime.remove('*');
        // TurnOffAllSound();
        localStorage.removeItem('userdata');
        localStorage.removeItem('isRefreshed');
        localStorage.removeItem('gametype');
        localStorage.removeItem('volume'); 
        localStorage.removeItem('totalplayer');
        localStorage.removeItem('playercount');
        if(tag === 'creator'){
            startTransition(()=>{navigate('/home');});
        }
        else if(tag === 'player'){
            startTransition(()=>{navigate('/');});
        }
      };

    // const totalplayer = localStorage.getItem('totalplayer');
    // const currentcount = localStorage.getItem('playercount');
    return(
        <div className="w-full min-h-screen bg-[#EDEFF7] flex flex-col gap-5 items-center justify-center">
            {isRefreshed === 'true' || !isRefreshed ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="font-bold text-xl">You have been disconnected</div>
                    <div className="font-bold text-base">(Refresh the page or click the exit button to exit)</div>
                </div>
            ):(
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <div className="font-bold text-xl">Waiting for Players</div>
                        <l-bouncy size="25" speed="1.75"  color="black" ></l-bouncy>
                    </div>
                    {tag==='creator' &&(
                        <div className="font-bold text-xl">{current} / {total}</div>
                    )}
                </div>
            )}

            {/* <l-dot-spinner size='40' speed='0.9' color='black'></l-dot-spinner> */}
            {tag === 'creator' &&  isRefreshed === 'false' ?(
                <div onClick={forcestart} className=" bg-[#FAFAFA] cursor-pointer px-6 py-3 shadow-md rounded-full font-bold active:shadow-inner">FORCE START</div>
            ):isRefreshed === 'true' || !isRefreshed && (
                <div onClick={handleExit} className=" bg-[#FAFAFA] cursor-pointer px-6 py-3 shadow-md rounded-full font-bold active:shadow-inner">EXIT</div>
            )}
        </div>
    )
}