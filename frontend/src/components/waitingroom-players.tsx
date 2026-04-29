import { useEffect } from "react";
import { PlayerAttributes } from "../dto/player.dto";

interface playerProps {
    uuid:string;
    players:PlayerAttributes[];
    totalplayers:number;
}
export default function WaitingRoomPlayers({uuid, players, totalplayers}:playerProps):JSX.Element{

    return(
        <div className="flex flex-col">
            <div className="flex flex-col justify-center w-full items-center relative mt-6 mb-10">
                <div className="bg-[#FAFAFA] w-11/12 h-[5px] rounded-md shadow-md"></div>
                <div className="font-bold text-center bg-[#FAFAFA] w-64 py-3 rounded-xl absolute bottom-0 min-[550px]:left-0 mx-10 transform translate-y-1/2 shadow-md">Total Players : {totalplayers}</div>
            </div>
            <div className="flex flex-wrap items-center max-[550px]:justify-center max-[550px]:gap-4 min-[550px]:gap-6 px-10 my-5 h-full">
                {players.map((player,index)=>(    
                    <div key={index} className={` shadow-md bg-[#FAFAFA] w-64 px-4 py-3 rounded-xl text-center font-bold ${uuid===player.uuid?'text-[#F4976C] shadow-[#F4976C]':'text-[#686C8C] shadow-[#686C8C]'}`}>{player.username.length > 15 ? `${player.username.slice(0, 15)}...` : player.username}</div>
                ))}
                </div>
        </div>
    )
}