import { startTransition, useState } from "react";
import { GameAttributes } from "../dto/game.dto";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import DeleteConfirmation from "./deletebuttonconfirmation";

import socket from "../utils/socket";
import LoadingAnimationScreen from "./loadinganimation";
import { RiArrowRightLine, RiArrowRightSLine, RiDeleteBin2Line, RiEditLine, RiGroupFill, RiPlayFill, RiStopFill } from "react-icons/ri";
import { dotPulse, lineSpinner, ping } from "ldrs";

dotPulse.register();
ping.register();
lineSpinner.register();
interface GameListProps {
  gamelist:GameAttributes[],
  deleteOneGame:(UpdatedGameList:GameAttributes[]) => void;
}

export default function GameList({ gamelist, deleteOneGame }: GameListProps): JSX.Element {
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');
  const [start, setStart] = useState(false);
  const token = Cookie.get('token');
  const navigate = useNavigate();
  const text = 'Are you sure you want to delete this?';
  const handleEdit = (gameid:string) => {
    if(!token){
      navigate('/');
    }
    startTransition(()=>{
      navigate(`/gamedetail/${gameid}/edit`);
    });
  }

  const handleDelete = async (gameid:string) => {
    try {
      const response = await axios.delete(API_URL+`/game/${gameid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}})
      console.log('Game has been deleted', response.data);
      const updatedGames = gamelist.filter((game)=>game.uuid !== gameid);
      deleteOneGame(updatedGames);
      setDeleteConfirmation('');
    } catch (error) {
      console.error(error);
    }
    
  }

  const handleDeleteConfirmation = (gameid:string) => {
      if(!token){
        navigate('/');
    }
    setDeleteConfirmation(gameid);
  }

  const handlePlay = async (gamecode:string, gameid:string) => {
    if(!token){
      navigate('/');
    }
    try {
      const record = await axios.get(API_URL+`/record/create/${gameid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
      console.log("creator create the record", record);
      if(!record){
        console.log("the game is still on play")
      } 
      else{
        const recordid = record.data.uuid;
        const gameid = record.data.gameid;
        const tag = 'creator';
        const username = 'creator';
        const uuid = 'creator';
        // move the questions to mongodb temporarily, when the game ends, the mongodb will be deleted.
        await axios.post(API_URL+`/question/migrate/`,{gameid, gamecode}, {headers:{Authorization:`Bearer ${token}`}});
        /////////////////////////////////////////////////////////////////////////////////////////////
        const userdata = {recordid,gameid,gamecode,tag,username,uuid};
        const userdataJSON = JSON.stringify(userdata);
        localStorage.setItem("userdata", userdataJSON);
        localStorage.setItem('isRefreshed', 'false');
        socket.emit('joinAsCreator', {recordid, gameid});
        setStart(true);
        setTimeout(() => {
          setStart(false);
          // const newTab = window.open(`/room/${gamecode}`, '_blank');
          // if (newTab) {
          //   // Focus on the newly opened tab if it's available
          //   newTab.focus();
          // } else {
            // If the pop-up blocker prevents opening the tab, navigate in the current tab
          navigate(`/room/${gamecode}`);
          // }
        }, 300);
      }
    } catch (error) {
      console.error(error);
    }
  }
  //////////// RECORD ACCESS
  const handleRecord = (gameid:string) => {
    if(!token){
      navigate('/');
    }
    startTransition(()=>{
        navigate(`/record/${gameid}`);
    });
    
  }

  //FORCE CLOSE
  const forcestop = async (gameid:string) => {
    const button = document.getElementById(`stop-${gameid}`) as HTMLButtonElement;
    const buttonsign = document.getElementById(`stopsign-${gameid}`) as HTMLElement;
    const buttonbar = document.getElementById(`stopbar-${gameid}`) as HTMLElement;
    if(button && buttonsign && buttonbar)
    button.disabled = true;
    button.style.backgroundColor = '#EF4444';
    button.style.opacity = '0.5';
    buttonsign.style.color = '#FAFAFA';
    buttonsign.style.opacity = '0.5';
    buttonbar.style.display = 'flex';
    try {
      const response = await axios.delete(API_URL+`/record/force/${gameid}`, {headers:{Authorization:`Berear ${token}`,"ngrok-skip-browser-warning": "69420"}})
      const recordid = response.data.recordid.uuid;
      console.log('THRE RECORDID"', recordid);
      socket.emit('forceclosed', {recordid,gameid});
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
    } catch (error) {
      console.error(error);
    }
    
  }

  // const buttons = gamelist.map((game, index: number) => {
  //   const isMainButtonHovered = hoveredGame === index;
    
  //   return (
  //     <div
  //       key={index}
  //       onMouseEnter={() => handleMouseEnter(index)}
  //       onMouseLeave={handleMouseLeave}
  //       className="flex flex-col h-[300px]"
  //     >
  //       <button
  //         onClick={()=>{handlePlay(game.gamecode, game.uuid)}}
  //         className={` shadow-md overflow-auto hide-scroll break-words p-8 bg-[#303C6C] text-[#FAFAFA] w-96 h-96 text-3xl rounded-3xl relative hover:bg-[#202848] transition-height ease-in-out duration-200 mt-4 ${
  //           isMainButtonHovered ? "mb-2" : ""
  //         }`}
  //       >
  //         {isMainButtonHovered ? (
  //           <div className=" flex justify-evenly items-center ">
  //             <div className="flex-1 text-sm text-center">{game.gametitle.length > 100 ? `${game.gametitle.slice(0, 100)}...` : game.gametitle}</div>
  //             <div className="w-[1px] h-[100px] bg-[#FAFAFA]"></div>
  //             <div className="flex-1 font-bold">{play_text}</div>
  //           </div>
  //         ) : (
  //           <>
  //             {game.gametitle.length > 100 ? `${game.gametitle.slice(0, 100)}...` : game.gametitle} 
  //             <span className=" absolute bottom-3 left-1/2 text-xs transform -translate-x-1/2">{game.groupnumber === 1? 'singleplayer': `multiplayer ${game.groupnumber} players / group`}</span> 
  //           </>
  //           )
  //         } 
  //       </button>
  //       {isMainButtonHovered && (
  //         <div className=" flex bg-[#B4DFE5] w-96 h-20 gap-2 px-2 py-2 text-3xl rounded-[50px] justify-evenly items-center">
  //           <button onClick={()=>{handleEdit(game.uuid)}} className="bg-[#88ABB2] text-[#FAFAFA] flex-1 py-2 text-lg rounded-3xl transition-all duration-200 hover:bg-[#6A848A] hover:text-[#D2FDFF]">Edit</button>
  //           <button onClick={()=>{handleDeleteConfirmation(game.uuid)}} className="bg-[#88ABB2] flex-1 text-[#FAFAFA] py-2 text-lg rounded-3xl transition-all duration-200 hover:bg-[#F4976C] hover:text-[#D2FDFF]">Delete</button>
  //           <button onClick={()=>{handleRecord(game.uuid)}} className="bg-[#88ABB2] text-[#FAFAFA] flex-1 py-2 text-lg rounded-3xl transition-all duration-200 hover:bg-[#6A848A] hover:text-[#D2FDFF]">Record</button>
  //         </div>
  //       )}
        
  //     </div>
      
  //   );
  // });

  return (
      <>
        {/* <div className="flex flex-wrap justify-center items-center gap-6 px-20">{buttons}</div> */}
        {gamelist.length === 0 && (
          <div className="flex h-full justify-center items-center">
            <div className=" text-gray-400 text-5xl font-bold text-center">No Games Are Found</div>
          </div>
        )}
        <div className="max-[550px]:mx-5 min-[550px]:mx-20">
          {gamelist.map((game,index)=>(
            <div key={index} className="flex bg-[#FAFAFA] p-8 rounded-[40px] my-5 shadow-lg">
              <div className="flex-1 flex flex-col gap-5 overflow-auto break-words">
                <div className="max-[550px]:text-lg min-[550px]:text-xl font-bold text-[#233160] ">{game.gametitle}</div>
                <div className="flex max-[550px]:gap-1 min-[550px]:gap-2">
                  <div className="flex justify-center items-center bg-[#303C6C] text-[#FAFAFA] text-xs rounded-md shadow-md px-2 h-6">{game.groupnumber === 1? 'singleplayer': `multiplayer`}</div>
                  {game.groupnumber > 1 && (
                    <div className="flex justify-center items-center bg-[#303C6C] text-[#FAFAFA] text-xs rounded-md shadow-md px-2 h-6 gap-1"><span className="font-bold">{game.groupnumber}</span><RiGroupFill /></div>
                  )}
                  <div className={`flex justify-center items-center bg-[#303C6C] text-[#FAFAFA] text-xs rounded-md shadow-md pl-2 pr-3 h-6 py-1 ${game.is_play === false ?' bg-green-400':' bg-red-400'}`}>{game.is_play === false? (
                    <>
                      <l-ping size={10} speed={2} color={'green'}></l-ping>
                      <span className="ml-1">Ready</span>
                    </>
                    ):(
                      <>
                        <l-ping size={10} speed={2} color={'red'}></l-ping>
                        <span className="ml-1">Busy</span>
                      </>
                      )}</div>
                </div>
                <div className="flex">
                  <button onClick={()=>{handleRecord(game.uuid)}} className="flex justify-center items-center bg-[#FAFAFA] border-2 border-[#233160] text-[#233160] text-xs font-bold rounded-3xl px-6 py-2 shadow-lg transition-all duration-200 hover:bg-[#233160] hover:text-[#FAFAFA]">See Record(s)
                    <span className="ml-1 border-2 border-[#233160] bg-[#FAFAFA] p-[1px] rounded-2xl">
                      <RiArrowRightLine className="font-bold text-[#233160]" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="
                        max-[550px]:w-[90px] min-[550px]:w-[210px] 
                        flex flex-col justify-between">
                <div className=" justify-end items-end flex gap-3">
                  <button
                    onClick={()=>{handleEdit(game.uuid)}}
                    className="w-9 h-9 rounded-3xl border-2 border-[#FAFAFA]  shadow-md flex items-center justify-center transition-all duration-200 hover:bg-[#233160]"
                    >
                    <RiEditLine className=" w-full h-full p-2 text-[#233160] hover:text-[#FAFAFA]" />
                  </button>
                  <button
                    onClick={()=>{handleDeleteConfirmation(game.uuid)}}
                    className="w-9 h-9 rounded-3xl border-2 border-[#FAFAFA]  shadow-md flex items-center justify-center transition-all duration-200 hover:bg-[#233160]"
                    >
                    <RiDeleteBin2Line className=" w-full h-full p-2 text-[#233160] hover:text-[#FAFAFA]" />
                  </button>
                </div>
                <div className=" justify-end items-end flex">
                  {game.is_play === false ? (
                    <button
                      onClick={()=>{handlePlay(game.gamecode, game.uuid)}}
                      className="w-14 h-14 mr-[14px] rounded-[50px] border-2 border-[#FAFAFA]  shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-[#233160]"
                      >
                      <RiPlayFill className=" w-full h-full p-3 text-[#233160] hover:text-[#FAFAFA]" />
                    </button>
                  ):(
                  <div className=" flex justify-end items-end gap-2">
                    <div className=" text-red-500 font-bol text-xs">Still Running <l-dot-pulse size={15} speed={1.4} color={'red'}></l-dot-pulse></div>
                    <button 
                    id={`stop-${game.uuid}`}
                    onClick={()=>{forcestop(game.uuid)}}
                    className="relative w-14 h-14 ml-4 mr-[14px] rounded-[50px] border-2 border-[#FAFAFA]  shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-red-500"
                    >
                    <RiStopFill id={`stopsign-${game.uuid}`} className=" w-full h-full p-3 text-red-500 hover:text-[#FAFAFA]"/>
                    <span id={`stopbar-${game.uuid}`} className="absolute justify-center items-center hidden">
                      <l-line-spinner size={20} stroke={3} speed={1} color='black'></l-line-spinner>
                    </span>
                    </button>
                    
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {deleteConfirmation && (<DeleteConfirmation onConfirm={()=>{handleDelete(deleteConfirmation)}} onCancel={()=>{setDeleteConfirmation('')}} text={text}/>)}
        {start && (<LoadingAnimationScreen/>)}
      </>
  );
}
