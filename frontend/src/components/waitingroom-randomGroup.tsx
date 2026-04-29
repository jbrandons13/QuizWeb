import { PlayerAttributes } from "../dto/player.dto";

interface WaitingRoomMultiPlayersProps {
    uuid: string,
    group: PlayerAttributes[][];
    totalplayers:number;
}

export default function WaitingRoomMultiPlayers({ uuid, group, totalplayers}: WaitingRoomMultiPlayersProps): JSX.Element {
    return (
        <div>
            <div className="w-full">
                <div className="flex flex-col justify-center w-full items-center relative mt-6 mb-10">
                    <div className="bg-[#FAFAFA] w-11/12 h-[5px] rounded-md shadow-md "></div>
                    <div className="font-bold text-center bg-[#FAFAFA]  w-64 py-3 rounded-xl absolute bottom-0 min-[550px]:left-0 mx-10 transform translate-y-1/2 shadow-md">Total Players : {totalplayers}</div>
                </div>
                <div className="flex flex-wrap max-[550px]:justify-center gap-6 px-10">
                    {group.map((innerArray, index) => (
                        <div key={index} className="bg-[#303C6C] rounded-lg w-64 text-center px-5 pt-1 pb-3">
                            <div className="text-[#FAFAFA] tracking-widest font-light">Group {index + 1}</div>
                            <div className="">
                                {innerArray.map((player, i) => (
                                    <div key={i} className={`bg-[#FAFAFA] rounded-md px-8 py-2 my-2 ${uuid===player.uuid?'text-[#F4976C]':''}`}>
                                        {player.username.length > 15 ? `${player.username.slice(0, 15)}...` : player.username}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
