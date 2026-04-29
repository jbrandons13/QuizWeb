import axios from "axios";
import { SetStateAction, useEffect, useState } from "react"
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import { GroupData, RecordData } from "../dto/record.dto";

interface RecordDetailProps{
    recordid:string;
    totalquestion:number;
}

export default function GroupRecordDetail({recordid, totalquestion}:RecordDetailProps):JSX.Element{
    const token = Cookie.get("token");
    const [players, setPlayers] = useState<RecordData[]>([]);
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [playersInGroup, setPlayersInGroup] = useState<RecordData[]>([]);
    const [activePlayer, setActivePlayer] = useState<string|null>('');
    const [activeGroup, setActiveGroup] = useState<string|null>('');

    const handleActiveGroup = (groupid:string)=>{
        const specificGroup = groups.find(group => group.groupid === groupid);
        let playersInSpecificGroup:RecordData[] = [];
        if(specificGroup){
            specificGroup.players.forEach((member,index)=>{
                const player = players.find(player=> player.playerid === member.playerid);
                if(player){
                    playersInSpecificGroup.push(player)
                }
            })
        }
        
        setPlayersInGroup(playersInSpecificGroup);
        setActiveGroup(groupid === activeGroup ? null : groupid);
    }

    const handleActivePlayer = (playerid:string) => {
        setActivePlayer(playerid === activePlayer ? null : playerid);
    };

    useEffect(()=>{
        const getData = async () =>{
            try {
                const playersResponse = await axios.get(API_URL+`/record/data/${recordid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
                const groupsResponse = await axios.get(API_URL+`/record/group/${recordid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
                setPlayers(playersResponse.data);
                setGroups(groupsResponse.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    },[recordid])
    return(
        <div>
            <div className="flex flex-col">
                <div className="flex bg-[#233160] font-semibold rounded-lg mb-2">
                    <div className=" w-36  py-6 text-[#F7FFF7] text-center">Rank</div>
                    <div className="flex-1 py-6 text-[#F7FFF7] text-center">Group</div>
                    <div className=" w-36  py-6 text-[#F7FFF7] text-center">Group Score</div>
                </div>
            </div>

            {groups.map((group, index) => (
                <div key={index} className={`flex flex-col ${activeGroup===group.groupid?' border-2 border-[#202848] rounded-lg my-1':''}`}>
                    <div onClick={() => handleActiveGroup(group.groupid)} className={`flex  bg-[#FAFAFA] hover:bg-[#BEBEBE] hover:cursor-pointer ${activeGroup===group.groupid?'bg-[#FAFAFA] my-0 rounded-bl-none rounded-br-none rounded-md':'my-1 rounded-lg'}`}>
                        <div className="max-[550px]:w-24 min-[550px]:w-36   py-4 text-center">{group.ranking}</div>
                        <div className="flex-1 py-4 text-center">Group {group.groupnumber}</div>
                        <div className="max-[550px]:w-24 min-[550px]:w-36   py-4 text-center">{group.groupscore}</div>
                    </div>
                    {activeGroup === group.groupid && (
                        <div className="max-[550px]:px-5 min-[550px]:px-12 pb-2 bg-[#FAFAFA] rounded-lg">
                            <div className="flex justify-center items-center pb-2">
                                <div className  ="bg-[#202848] w-full h-[5px] rounded-md "></div>
                            </div>
                            {playersInGroup.map((player, index) => (
                                <div key={index} className="flex flex-col">
                                    
                                    <div onClick={() => handleActivePlayer(player.playerid)} className={`flex my-1 rounded-lg bg-[#6D8AF5] text-[#EDEFF7] hover:bg-[#5369BD] hover:cursor-pointer ${activePlayer === player.playerid?' rounded-b-none mb-0':''}`}>
                                        <div className="flex-1 px-4 py-1">{player.username} {player.questionAndAnswers.length !== totalquestion ? <span className=" text-red-500 font-semibold">(The player was disconnected during the game)</span>:''}</div>
                                        <div className=" w-16 p-1 text-center">{player.score}</div>
                                    </div>
                                    
                                    
                                    {activePlayer === player.playerid && player.questionAndAnswers &&(
                                        <div className="max-[550px]:px-2 min-[550px]:px-12 bg-[#FAFAFA] border-2 border-[#ABBCF9] rounded-b-lg">
                                            <div className="flex justify-between my-4">
                                                <div className="max-[550px]:text-sm min-[550px]:text-base">
                                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                                        <div className="max-[550px]:text-xs max-[550px]:w-40 min-[550px]:w-56">Total Question</div>
                                                        <div>:</div>
                                                        <div>{totalquestion}</div>
                                                    </div>
                                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                                        <div className="max-[550px]:text-xs max-[550px]:w-40 min-[550px]:w-56">Total Viewed Question</div>
                                                        <div>:</div>
                                                        <div>{player.questionAndAnswers.length}</div>
                                                    </div>
                                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                                        <div className="max-[550px]:text-xs max-[550px]:w-40 min-[550px]:w-56">Total Correct Question</div>
                                                        <div>:</div>
                                                        <div>{player.questionAndAnswers.filter(data=> data.answer === data.playeranswer).length}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col max-[550px]:text-sm min-[550px]:text-base">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-lg bg-[#BDC3D5]`}></div><span> Unanswered</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-lg bg-[#5DECBF]`}></div><span> Correct</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-lg bg-[#C75F84]`}></div><span> Incorrect</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {player.questionAndAnswers.map((question, index)=>(
                                                <div key={index} className="my-5">
                                                    <div className="flex justify-center items-center">
                                                        <div className  ="bg-[#535A74] w-full h-[1px] "></div>
                                                    </div>
                                                    <div className="flex justify-between mt-5 mb-1 gap-5">
                                                        <div className="flex justify-center items-center text-[#263157]  "><span className=" w-full">Question title</span></div>
                                                        <div className="flex justify-center items-center ">:</div>
                                                        <div className="flex-1 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.questiontitle}</span></div>
                                                    </div>
                                                    <div className="flex gap-3 my-1 items-center">
                                                        <div className={`w-4 h-4 rounded-lg ${question.playeranswer === question.answer && question.playeranswer === 1? 'bg-[#5DECBF]' : (question.playeranswer === 1 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option1}</span></div>
                                                    </div>
                    
                                                    <div className="flex gap-3 my-1 items-center">
                                                        <div className={`w-4 h-4 rounded-lg ${question.playeranswer === question.answer && question.playeranswer === 2? 'bg-[#5DECBF]' : (question.playeranswer === 2 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option2}</span></div>
                                                    </div>
                    
                                                    <div className="flex gap-3 my-1 items-center">
                                                        <div className={`w-4 h-4 rounded-lg ${question.playeranswer === question.answer && question.playeranswer === 3? 'bg-[#5DECBF]' : (question.playeranswer === 3 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option3}</span></div>
                                                    </div>
                    
                                                    <div className="flex gap-3 my-1 items-center">
                                                        <div className={`w-4 h-4 rounded-lg ${question.playeranswer === question.answer && question.playeranswer === 4? 'bg-[#5DECBF]' : (question.playeranswer === 4 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                                        <div className=" flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option4}</span></div>
                                                    </div>
                                                    
                                                    <div>
                                                        {question.answer !== question.playeranswer && (
                                                            <div className="flex justify-between my-1 gap-5">
                                                                <div className="flex justify-center items-center text-[#263157]"><span className=" w-full">Correct Answer</span></div>
                                                                <div className="flex justify-center items-center ">:</div>
                                                                <div className="flex-1 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{(question as any)[`option${question.answer}`]}</span></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}