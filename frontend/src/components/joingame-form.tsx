import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from 'js-cookie';
import { API_URL } from "../config/config";
import socket from "../utils/socket";
import { UUIDGenerator } from "../utils/generator";
import LoadingAnimationScreen from "./loadinganimation";

interface JoinGameFormProps {
    //
    gamecode?:string
}

const JoinGameForm: React.FC<JoinGameFormProps> = (data) => {
    const navigate = useNavigate();
    const [gamecode, setGameCode] = useState('');
    const [username, setUsername] = useState('');
    const [fromLink, setFromLink] = useState(false);
    const tag = 'player';
    useEffect(()=>{
        if(data.gamecode !== undefined){
            setGameCode(data.gamecode);
            setFromLink(true);
        }
    },[]);

    const [flag, setFlag] = useState(false);
    const [flagVal, setFlagVal] = useState('');

    const [start, setStart] = useState(false);

    const handleGameCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameCode(e.target.value);
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(loading === false){
            setLoading(true);
            try {
                const response = await axios.post(API_URL + `/record/join`, { gamecode },{headers:{"ngrok-skip-browser-warning": "69420"}});
                if (response.status === 200) {
                    if(response.data.text === 'Success'){
                        setFlag(false);
                        const recordData = response.data.value;
                        console.log('Success: Retrieved record ID', recordData);
        
                        const { uuid: recordid, gameid } = recordData;
                        const uuid = UUIDGenerator();
                        const userdata = { recordid, gameid, gamecode, tag, username, uuid };
                        const userdataJSON = JSON.stringify(userdata);
        
                        localStorage.setItem("userdata", userdataJSON);
                        localStorage.setItem('isRefreshed', 'false');
        
                        setStart(true);
                        setTimeout(() => {
                            setStart(false);
                            setLoading(false);
                            socket.emit('joinWaitingRoom', { recordid, gameid, gamecode, username, uuid });
                            navigate(`/room/${gamecode}`);
                        }, 300);
                    }
                    else{
                        setLoading(false);
                        setFlag(true);
                        setFlagVal(response.data.text);
                    }
                }
    
            } catch (error: any) {
                console.log(error);
            }
        }
    }

    useEffect(()=>{
        if(flag){
            const gamecodeinput = document.getElementById('gamecode') as HTMLInputElement;
            const usernameinput = document.getElementById('username') as HTMLInputElement;
            if(gamecodeinput){
                gamecodeinput.value = '';
            }
            if(usernameinput){
                usernameinput.value = '';
            }
            
            setTimeout(() => {
                setFlag(false);
            }, 1500);
        }
    },[flag]);

    return (
        <>
        <div className="max-[550px]:w-11/12 min-[550px]:px-20
                        max-[550px]:pt-2 min-[550px]:pt-10
                        max-[550px]:pb-[5px] min-[550px]:pb-[20px]
                           bg-[#FAFAFA] drop-shadow-xl">
            <form onSubmit={handleSubmit} className="flex flex-col max-[550px]:gap-1 min-[550px]:gap-10 items-center">
                <h2 className="w-full text-center max-[550px]:text-2xl min-[550px]:text-3xl text-[#303C6C]">Join Game</h2>
                <div className="flex flex-col max-[550px]:gap-3 min-[550px]:gap-10">
                    <div className="flex justify-center items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl text-[#303C6C]">
                        <input
                            type="text"
                            required
                            name="gamecode"
                            id="gamecode"
                            value={gamecode}
                            placeholder="Game Code"
                            onChange={handleGameCodeChange}
                            className="p-1.5 bg-[#FAFAFA] border-b-2 text-center"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-3 max-[550px]:text-lg min-[550px]:text-xl text-[#303C6C]">
                        <input
                            type="text"
                            required
                            name="username"
                            id="username"
                            placeholder="Username"
                            onChange={handleUsernameChange}
                            className="p-1.5 bg-[#FAFAFA] border-b-2 text-center"
                        />
                    </div>
                </div>
                <button id="submitbutton" type="submit" className={`text-md w-32 h-12 text-center  text-[#303C6C] font-bold shadow-md  rounded-sm transition-all duration-200 hover:bg-[#B3B5BD] active:shadow-inner ${loading === true ? ' bg-[#B3B5BD] cursor-wait':'bg-[#EDEFF7]'}`}>Submit</button>
                
            </form>
                <div className="h-[20px] mt-2 text-red-500 text-xs text-center">{flag ? `${flagVal}`:''}</div>
        </div>
        {start && (<LoadingAnimationScreen/>)}
        </>
    )
}

export default JoinGameForm;
