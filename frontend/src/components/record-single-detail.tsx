import axios from "axios";
import { useEffect, useState } from "react"
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import { RecordData } from "../dto/record.dto";

interface RecordDetailProps{
    recordid:string;
    totalquestion:number;
}

export default function SingleRecordDetail({recordid, totalquestion}:RecordDetailProps):JSX.Element{
    const token = Cookie.get("token");
    const [data, setData] = useState<RecordData[]>([]);
    const [activePlayer, setActivePlayer] = useState<string|null>('');
    const handleActivePlayer = (playerid:string) => {
        setActivePlayer(playerid === activePlayer ? null : playerid);
    };

    useEffect(()=>{
        const getData = async () =>{
            try {
                const response = await axios.get(API_URL+`/record/data/${recordid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    },[recordid])
    return(
        <>
            <div className="flex flex-col ">
                <div className="flex bg-[#233160] font-semibold rounded-lg mb-2">
                    <div className=" w-36  py-6 text-[#F7FFF7] text-center">Rank</div>
                    <div className="flex-1 py-6 text-[#F7FFF7] text-center">Username</div>
                    <div className=" w-36  py-6 text-[#F7FFF7] text-center">Score</div>
                </div>
            </div>
            {data.map((each, index) => (
                <div key={index} className={`flex flex-col ${activePlayer===each.playerid?' border-2 border-[#202848] rounded-lg my-1':''}`}>
                    <div onClick={() => handleActivePlayer(each.playerid)} className={`flex  bg-[#FAFAFA] hover:bg-[#BEBEBE] hover:cursor-pointer ${activePlayer===each.playerid?'bg-[#FAFAFA] my-0 rounded-bl-none rounded-br-none rounded-md':'my-1 rounded-lg'}`}>
                        <div className="max-[550px]:w-24 min-[550px]:w-36   py-4 text-center">{each.ranking}</div>
                        <div className="flex-1 py-4 text-center">{each.username} {each.questionAndAnswers.length !== totalquestion ?<span className=" text-red-500 font-semibold"> (The player was disconnected during the game)</span>:''}</div>
                        <div className="max-[550px]:w-24 min-[550px]:w-36   py-4 text-center">{each.score}</div>
                    </div>
                    {activePlayer === each.playerid && each.questionAndAnswers &&(
                        <>
                        
                        <div className="max-[550px]:px-5 min-[550px]:px-12 bg-[#FAFAFA] rounded-b-lg">
                            <div className="flex justify-center items-center">
                                <div className  ="bg-[#202848] w-full h-[10px] rounded-md "></div>
                            </div>

                            <div className="flex justify-between my-4">
                                <div className="max-[550px]:text-sm min-[550px]:text-base">
                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                        <div className="max-[550px]:text-[xs] max-[550px]:w-40 min-[550px]:w-56">Total Question</div>
                                        <div>:</div>
                                        <div>{totalquestion}</div>
                                    </div>
                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                        <div className="max-[550px]:text-xs max-[550px]:w-40 min-[550px]:w-56">Total Viewed Question</div>
                                        <div>:</div>
                                        <div>{each.questionAndAnswers.length}</div>
                                    </div>
                                    <div className="flex max-[550px]:gap-2 min-[550px]:gap-5">
                                        <div className="max-[550px]:text-xs max-[550px]:w-40 w min-[550px]:w-56">Total Correct Question</div>
                                        <div>:</div>
                                        <div>{each.questionAndAnswers.filter(data=> data.answer === data.playeranswer).length}</div>
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
                            {each.questionAndAnswers.map((question, index)=>(
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
                                        <div className={`w-4 h-4 rounded-lg  ${question.playeranswer === question.answer && question.playeranswer === 1? 'bg-[#5DECBF]' : (question.playeranswer === 1 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option1}</span></div>
                                    </div>

                                    <div className="flex gap-3 my-1 items-center">
                                        <div className={`w-4 h-4 rounded-lg rounded-2xl  ${question.playeranswer === question.answer && question.playeranswer === 2? 'bg-[#5DECBF]' : (question.playeranswer === 2 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option2}</span></div>
                                    </div>

                                    <div className="flex gap-3 my-1 items-center">
                                        <div className={`w-4 h-4 rounded-lg rounded-2xl ${question.playeranswer === question.answer && question.playeranswer === 3? 'bg-[#5DECBF]' : (question.playeranswer === 3 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
                                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{question.option3}</span></div>
                                    </div>

                                    <div className="flex gap-3 my-1 items-center">
                                        <div className={`w-4 h-4 rounded-lg rounded-2xl ${question.playeranswer === question.answer && question.playeranswer === 4? 'bg-[#5DECBF]' : (question.playeranswer === 4 ? 'bg-[#C75F84]' : 'bg-[#BDC3D5]')}`}></div>
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
                        </>
                    )}
                </div>
            ))}
        </>
    )
}