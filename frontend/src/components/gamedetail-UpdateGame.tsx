import axios from "axios";
import { useEffect, useState } from "react"
import { API_URL } from "../config/config";
import { useNavigate, useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { GameAttributes } from "../dto/game.dto";
import { RiGroupFill, RiSaveFill } from "react-icons/ri";
import anime from "animejs";
import { act } from "react-dom/test-utils";

export default function UpdateGame({game}:{game:GameAttributes}):JSX.Element{

    const {uuid, action} = useParams();
    const token = Cookie.get("token"); 
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');
    const [number, setNumber] = useState<number>(1);

    useEffect(()=>{
        if(game){
            setTitle(game.gametitle);
            setNumber(game.groupnumber);
            if(action ==='edit'){
                if(game.groupnumber > 1){
                    setGamemode(true);
                    anime({
                        targets:'#gamemodebutton',
                        duration:100,
                        easing: 'easeOutQuad',
                        translateX: '24px'
                    })
                    
                }
                else{
                    setGamemode(false);
                    anime({
                        targets:'#gamemodebutton',
                        duration:100,
                        easing: 'easeOutQuad',
                        translateX: '0'
                    })
                }
            }
            
        }
    },[]);

    const handleInputClick = (e:React.MouseEvent<HTMLInputElement, MouseEvent>) =>{
        e.currentTarget.select();
    }
    const handleTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }
    const handleNumber = (e:React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const parsedNumber = parseInt(inputValue, 10);
        if(parsedNumber > 10){
            setNumber(10);
            return;
        }
        if (parsedNumber > 0) {
            setNumber(parsedNumber);
        }
        if(Number.isNaN(parsedNumber)){
            setNumber(0);
        }
    }
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(API_URL+`/game/${uuid}`,{gametitle:title, groupnumber:number},{headers: {Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning": "69420" },});
            console.log('Game Saved', response.data);
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    }
    const [gamemode, setGamemode] = useState(false);
    const handleGameMode = () =>{
        if(action !== 'edit'){

            setGamemode(!gamemode);
            const gamemodebutton = document.getElementById('gamemodebutton');
            if(!gamemode){
                setNumber(2);
                anime({
                    targets:gamemodebutton,
                    duration:300,
                    easing: 'easeOutQuad',
                    translateX: '24px'
                })
            }
            if(gamemode){
                setNumber(1);
                anime({
                    targets:gamemodebutton,
                    duration:300,
                    easing: 'easeOutQuad',
                    translateX: '0'
                })
            }
        }
    }
        return(
            
            <form onSubmit={handleSubmit} className="w-full flex max-[550px]:flex-col justify-between items-top max-[550px]:px-5 min-[550px]:px-16 my-5">
            <div className="flex flex-col flex-1 min-[550px]:mr-10">
                <div className="flex max-[550px]:flex-col gap-1 mb-2 max-[550px]:items-center">
                    <div className="text-[#263157] max-[550px]:text-center w-36 flex justify-center items-center text-xl font-bold"><span className="w-full">Game Title</span></div>
                    {/* <div className=" flex justify-center items-center text-xl font-bold">:</div> */}
                    <input required type="text" value={title} onChange={handleTitle} onClick={handleInputClick} className="max-[550px]:w-full min-[550px]:flex-1 max-[550px]:text-center px-2 py-2 text-[#263157] bg-[#FAFAFA] rounded-xl text-lg shadow-md" />
                </div>
                <div className="flex max-[550px]:flex-col gap-1 mb-1 max-[550px]:items-center">
                    <div className="text-[#263157] max-[550px]:text-center w-36 flex justify-center items-center text-xl font-bold"><span className="w-full">Game Mode</span></div>
                    {/* <div className=" flex justify-center items-center text-xl font-bold">:</div> */}
                    <div className="flex max-[550px]:flex-col gap-2">
                        <div className="flex justify-center items-center">
                            <div className=" shadow-md w-36 px-[2px] py-[2px] bg-[#FAFAFA] border-2 border-[#FAFAFA] rounded-xl font-bold">
                                <div id="gamemodebutton" onClick={handleGameMode} className="bg-[#263157] text-[#FAFAFA] w-28 py-2 rounded-lg text-center cursor-pointer">{!gamemode?'Individual':'Groups'}</div>
                            </div>
                        </div>
                        {gamemode && (
                            <div className="flex gap-2">
                                <input required type="number" value={!gamemode? 1 : number > 1 && number <= 10 ? number.toString() : ''} readOnly={(action === 'edit') || (!gamemode)} onChange={handleNumber} onClick={handleInputClick} className="w-[80px] px-2 py-2 text-[#263157] bg-[#FAFAFA] rounded-xl text-lg text-center shadow-md" />
                                <div className="text-[#263157] flex justify-center items-center text-md font-bold"><RiGroupFill /> <span className="w-full ml-1 flex justify-center items-center">/ Group <span className="flex justify-center items-center ml-1">(Max:10 <RiGroupFill />)</span></span></div>
                            </div>
                        )}
                    </div>
                    {/* <div className=" flex justify-center items-center text-xl font-bold">:</div> */}
                </div>
                <div className={` text-red-500 max-[550px]:text-center`}>*Game Mode can only be modified on creation</div>
            </div>
            <div className="max-[550px]:flex max-[550px]:justify-center max-[550px]:item-center">
                <button type="submit" className="flex max-[550px]:w-11/12 max-[550px]:h-12 min-[550px]:w-20 min-[550px]:h-20 text-[#263157] bg-[#FBE8A6] rounded-full shadow-md active:shadow-inner text-lg items-center justify-center hover:bg-[#C3B27C] hover:border-0 transition-all duration-150 font-bold"><RiSaveFill className='text-[25px]' /></button>
            </div>
        </form>
        
    )
}
