import QRCode from "qrcode.react";
import { GameAttributes } from "../dto/game.dto";
import WaitingRoomSetting from "./waitingroom-setting";
import { RiLink } from "react-icons/ri";
import { useEffect, useState } from "react";

export default function WaitingRoomTitle({ game }: { game?: GameAttributes }):JSX.Element{
    const link = `https://fc09-140-138-144-110.ngrok-free.app/${game?.gamecode}`;
    const handleCopyLink = () => {
        navigator.clipboard.writeText(link)
        .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((error) => {
            console.error('Failed to copy:', error);
            // Handle any errors
          });
    }
    const [size, setSize] = useState(128);
    useEffect(() => {
        function checkWidth() {
            const width = window.innerWidth;
        
            if (width > 1280) { 
                setSize(128);
            } else if (width >= 800 && width <= 1280) {
                setSize(110);
            } else if (width >= 550 && width < 800) {
                setSize(100);
            } else {
                setSize(90);
            }
        }
    
        // Initial check
        checkWidth();
    
        // Listen for resize events
        window.addEventListener('resize', checkWidth);
    
        // Cleanup the event listener
        return () => {
        window.removeEventListener('resize', checkWidth);
        };
    }, []);
    return(
        <div className="relative w-full flex flex-col justify-center items-center bg-[#303C6C] pt-8 pb-32 shadow-lg">
            {game && (
                <>
                <div className={`text-center w-11/12 h-auto break-words font-bold text-white ${game.gametitle.length > 90 ?'max-[550px]:text-lg max-[800px]:text-xl max-[1280px]:text-2xl min-[1280px]:text-3xl ':game.gametitle.length > 60 ?'max-[550px]:text-xl max-[800px]:text-2xl max-[1280px]:text-3xl min-[1280px]:text-4xl ':'max-[550px]:text-2xl max-[800px]:text-3xl max-[1280px]:text-4xl min-[1280px]:text-5xl '}`}>{game.gametitle}</div>
                <div className="max-[550px]:w-[250px] max-[800px]:w-[350px] max-[1280px]:w-[450px] min-[1280px]:w-[550px] flex flex-col px-4 py-2 absolute bottom-0 transform translate-y-1/2  bg-[#FAFAFA] rounded-xl font-bold  text-center shadow-md">
                    <div className="flex items-center justify-between gap-4 ">
                        <div className="bg-[#FAFAFA] 
                        max-[550px]:text-lg 
                        max-[800px]:text-2xl 
                        max-[1280px]:text-4xl 
                        min-[1280px]:text-6xl 
                        shadow-md flex-1 
                        py-11 
                        rounded-3xl">
                            {game.gamecode}
                        </div>
                        <div className=" p-2 rounded-xl shadow-md ">
                            <QRCode size={size} value={link}/>
                        </div>
                    </div>
                    <div className="p-[2px] rounded-full shadow-md hover:shadow-inner mt-2">
                        <div onClick={handleCopyLink} className="flex items-center justify-center text-xs px-2 py-1 gap-1 tracking-[5px] rounded-full shadow-sm active:shadow-inner cursor-pointer">
                            Copy Link <RiLink />
                        </div>
                    </div>
                </div>
                </>
            )}
            <WaitingRoomSetting/>
        </div>
    )
}