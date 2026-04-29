import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../utils/socket";
import Cookie from 'js-cookie';
import DeleteConfirmation from "../components/deletebuttonconfirmation";
import WaitingRoomTitle from "../components/waitingroom-title";
import WaitingRoomPlayers from "../components/waitingroom-players";
import { API_URL } from "../config/config";
import { GameAttributes } from "../dto/game.dto";
import WaitingRoomMultiPlayers from "../components/waitingroom-randomGroup";
import { PlayerAttributes } from "../dto/player.dto";
import WaitingRoomSelectionGroup from "../components/waitingroom-selectionGroup";
import LoadingAnimationScreen from "../components/loadinganimation";
import { RiCursorFill, RiDoorClosedFill, RiDoorOpenFill, RiDoorOpenLine, RiPlayFill, RiSettings3Fill, RiSettingsFill, RiShuffleFill } from "react-icons/ri";
import anime from "animejs";
import WRBGM from "../musics/waitingroommusic";
import PlayerJoinSFX from "../musics/playerjoin";
import StartButtonSFX from "../musics/startbutton";
import { TurnOffAllSound } from "../musics/soundmanager";

export default function WaitingRoom(): JSX.Element { 
  // const checkexistence = async () => {
  //   try {
  //     const response = await axios.get(API_URL+`/record/check/${gameid}`,{headers:{"ngrok-skip-browser-warning": "69420"}});
  //     if(response.data.text === 'error'){
  //       if(tag ==='creator'){
  //         socket.emit('forceclosed', {recordid,gameid});
  //         setStart(true);
  //         setTimeout(() => {
  //           setStart(false);
  //           navigate('/home');
  //         }, 300);
  //       }
  //       if(tag ==='player'){
  //         handleExit();
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   // if(tag==='creator'){
  //     checkexistence(); // Initial fetch
  //   // }
  //   const intervalId = setInterval(() => {
  //     // if(tag==='creator'){
  //       checkexistence(); // Fetch updated game list every 10 seconds
  //     // } 
  //   }, 5000);
  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  // get localstorage info
  const storedUserData = localStorage.getItem('userdata');
  let userdata = null;
  if (storedUserData) {
    userdata = JSON.parse(storedUserData); 
  }
  const {recordid, gameid, gamecode, tag, username, uuid} = userdata || {};
  const navigate = useNavigate();
  const [exitConfirmation, setExitConfirmation] = useState(false);
  const [groupbutton, setGroupButton] = useState<Boolean>(false);
  const [random, setRandom] = useState<Boolean>(false);
  const isCreator = tag === 'creator';

  //to initiate bg music
  useEffect(()=>{
    WRBGM.playmusic();
  },[]);

  // listen and receive the playerlist
  const [players, setPlayers] = useState<PlayerAttributes[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  useEffect(()=>{
      socket.on('updatePlayers', (data:{usernames:[], totalusernames:number, status:string}) => {
          const {usernames, totalusernames, status} = data;
          if(status === 'join'){
            PlayerJoinSFX.playmusic();
          }
          if(status === 'resend'){
            console.log("PLAYER DATA HAS BEEN RESEND");
          }
          setPlayers(usernames);
          setTotalPlayers(totalusernames);
          const currenttotal = localStorage.getItem('waitingroomtotalplayer');
          // if(currenttotal !== '' && currenttotal === totalusernames.toString()){
          //   console.log("REQUEST FOR RESEND");
          //   socket.emit('waitingroomresendplayerdata',{ recordid, gameid });
          // }
          // else{
            console.log('total player : ' + totalusernames);
            localStorage.setItem('waitingroomtotalplayer', totalusernames.toString());
          // }
        });
        return () => {
          socket.off('updatePlayers');
      };
  },[players,totalPlayers]);
  
  const handleExitConfirmation = () => {
    setExitConfirmation(true);
  };
  const [dummygroup, setdummygroup] = useState<PlayerAttributes[][]>([]); 

  const handleExit = async () => {  
    console.log("DELETEDHANDLEEXIT");
    if(document.fullscreenElement) {
      document.exitFullscreen().then(() => {}).catch((error) => {
      console.error('Error exiting fullscreen:', error);
      });
    }
    if (isCreator) {
      const token = Cookie.get('token');
      socket.emit("roomIsDeleted", { recordid, gameid }); 
      await axios.delete(API_URL + `/record/${recordid}/${gameid}`, { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" } });
      console.log('room is deleted by creator');
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
      localStorage.removeItem('volume');
      localStorage.removeItem('waitingroomstatus');
      localStorage.removeItem('waitingroomtotalplayer');
      localStorage.removeItem('gamestatus');
      setStart(true);
      setTimeout(() => {
        setStart(false);
        navigate('/home');
      }, 300);
    } 
    else {
      if(groupbutton && !random){
        socket.emit("disconnectFromRoom", { recordid, gameid, username, playerid:uuid, gametype:'group', groups:selectiongroup });
      }
      else if(!groupbutton){
        socket.emit("disconnectFromRoom", { recordid, gameid, username, playerid:uuid, gametype:'single', groups:dummygroup});
      }
      console.log("player has exit from the room");
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
      localStorage.removeItem('volume');
      localStorage.removeItem('waitingroomstatus');
      localStorage.removeItem('waitingroomtotalplayer');
      localStorage.removeItem('gamestatus');
      setStart(true);
      setTimeout(() => {
        setStart(false);
        navigate('/');
      }, 300);
    }
    TurnOffAllSound();
    setExitConfirmation(false);
  };

  const [start, setStart] = useState(false);
  const handleStart = async () => {        
    localStorage.setItem('gamestatus', 'playing')
    const token = Cookie.get('token');
    await axios.post(API_URL+`/record/play`,{gameid}, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
    let gametype = '';
    if(groupbutton){
        localStorage.removeItem('waitingroomstatus');
        gametype = 'group';
        if(!random){
          if(players.length !==0){
            players.forEach((player,index)=>{
              let found = false;
              selectiongroup.forEach((group,i)=>{
                if(found){return};
                group.forEach((slot, j)=>{
                  if(found){return};
                  if(slot.username ==='' && slot.uuid === ''){
                    selectiongroup[i][j] = {uuid:player.uuid, username:player.username};
                    found = true;
                  }
                });
              });
            });
          }
          socket.emit('confirmSelectionGroup', {recordid, gameid, groups:selectiongroup});
        }
        else{
          localStorage.setItem('totalplayer', totalPlayers.toString());
        }
    }
    else{
      gametype = 'single';
      localStorage.setItem('totalplayer', totalPlayers.toString());
    }
    localStorage.setItem('playercount', '0');
    socket.emit('navigate', { path:'/play', recordid, gametype });
  };

    /////////////// HANDLE RANDOM GROUP
    const handleRandomGroup = async (groupcapacity:any) =>{
        const token = Cookie.get('token');
        await axios.post(API_URL+`/record/group`,{gameid}, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
        socket.emit('getrandomgroup',{recordid, gameid, groupcapacity});
    }

    // HANDLE GROUP SELECTION GROUP
    const handleSelectionGroup = async (groupcapacity:any) =>{
        const token = Cookie.get('token');
        await axios.post(API_URL+`/record/group`,{gameid}, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
        localStorage.setItem('totalplayer', totalPlayers.toString());
        socket.emit('initiateselectiongroup', {recordid,totalPlayers,groupcapacity});
    } 

    const handleRoomDeleted = () => {
        if(document.fullscreenElement) {
            document.exitFullscreen().then(() => {}).catch((error) => {
            console.error('Error exiting fullscreen:', error);
            });
        }
        localStorage.removeItem('userdata');
        localStorage.removeItem('isRefreshed');
        localStorage.removeItem('gametype');
        localStorage.removeItem('volume');
        localStorage.removeItem('waitingroomtotalplayer');
        localStorage.removeItem('gamestatus');
        setStart(true);
        TurnOffAllSound();
        setTimeout(() => {
          setStart(false);
          if(tag === 'creator'){
            navigate('/home');
          }
          else{
            navigate('/');
          }

        }, 300);
    };

    const handleNavigate = (data:{path:string, recordid:string, gametype:string}) => {
        const {path, recordid, gametype} = data;
        localStorage.setItem('gametype', gametype);
        localStorage.setItem('gamestatus', 'playing');
        StartButtonSFX.playmusic();
        setStart(true);
        setTimeout(() => {
          setStart(false);
          navigate(path);
        }, 300);
        
    };

    // get game for showing the gametitle
    const [game, setGame] = useState<GameAttributes | undefined>(undefined);
    useEffect(() => { 

        const getGame = async () => {
            const result = await axios.post(API_URL + `/room`, { gamecode },{headers:{"ngrok-skip-browser-warning": "69420"}});
            setGame(result.data);
        };
        getGame();

        socket.on('roomDeleted', handleRoomDeleted);
        socket.on('navigateplayer', handleNavigate);

        return () => {
            socket.off('roomDeleted', handleRoomDeleted);
            socket.off('navigateplayer', handleNavigate);
        };
    }, []);

    const [randomgroup, setRandomGroup] = useState<PlayerAttributes[][]>([]);
    useEffect(()=>{
        socket.on('sendrandomgroup', (data)=>{
            localStorage.setItem('waitingroomstatus', 'group');
            setStart(true);
            StartButtonSFX.playmusic();
            setTimeout(() => {
              setStart(false);
              setRandom(true);
              setGroupButton(true);
              setRandomGroup(data.groups);
            }, 300);
            
        })

        return () => {
            socket.off('sendrandomgroup');
        };
    },[randomgroup]);

    const [selectiongroup, setSelectionGroup] = useState<PlayerAttributes[][]>([]);
    useEffect(()=>{
        socket.on('initiatedselectiongroup', (data)=>{
            localStorage.setItem('waitingroomstatus', 'group');
            setStart(true);
            StartButtonSFX.playmusic();
            setTimeout(() => {
              setStart(false);
              setRandom(false); 
              setGroupButton(true);
              console.log("INTIATEDSELECTIONGROUP", data.emptygroup);
              setSelectionGroup(data.emptygroup);
              
            }, 300);
        })
        // socket.on('updatedSelectionGroup', (data:{usernames:[],totalusernames:number, groups:PlayerAttributes[][], status:string}) =>{
        //     const {usernames,totalusernames, groups, status} = data;
        //     if(status === 'remove'){
        //       const currentTotalPlayers = localStorage.getItem('totalplayer');
        //       if(currentTotalPlayers){
        //         const newTotalPlayers = parseInt(currentTotalPlayers, 10) - 1;
        //         localStorage.setItem('totalplayer', newTotalPlayers.toString());        
        //       }
        //     }
        //     setPlayers(usernames);
        //     setTotalPlayers(totalusernames);
        //     setSelectionGroup(groups);
        // });
        socket.on('updatedSelectionGroup', (data: { usernames: [], totalusernames: number,previousIndex:{prevgroupindex:number,prevslotindex:number}, updatedIndex: { groupIndex: number, slotIndex: number }, newuser:{username:string,uuid:string}, status: string }) => {
          const { usernames, totalusernames, previousIndex, updatedIndex, newuser, status } = data;
          setPlayers(usernames);
          setTotalPlayers(totalusernames);
          const { groupIndex, slotIndex } = updatedIndex;
          const {prevgroupindex, prevslotindex} = previousIndex;
          const {username, uuid} = newuser;
          const updatedGroups = [...selectiongroup];
          if(prevgroupindex !== -1 && prevslotindex !== -1){
            updatedGroups[prevgroupindex][prevslotindex] = {uuid:'',username:''};
          }
          updatedGroups[groupIndex][slotIndex] = { uuid, username }; // Update with actual username and uuid
          setSelectionGroup(updatedGroups);
      });

      socket.on('LeaveupdatedSelectionGroup', (data:{usernames:[],totalusernames:number, updatedIndex: { groupIndex: number, slotIndex: number }, status:string}) =>{
            const {usernames,totalusernames, updatedIndex, status} = data;
            if(status === 'remove'){
              const currentTotalPlayers = localStorage.getItem('totalplayer');
              if(currentTotalPlayers){
                const newTotalPlayers = parseInt(currentTotalPlayers, 10) - 1;
                localStorage.setItem('totalplayer', newTotalPlayers.toString());        
              }
            }
            setPlayers(usernames);
            setTotalPlayers(totalusernames);
            const {groupIndex, slotIndex} = updatedIndex;
            const updatedGroups = [...selectiongroup];
            if(groupIndex !== -1 && slotIndex !== -1){
              updatedGroups[groupIndex][slotIndex] = {uuid:'',username:''};
            }
      });
        return () => {
            socket.off('initiatedselectiongroup');
            socket.off('updatedSelectionGroup');
            socket.off('LeaveupdatedSelectionGroup')
        };
    },[selectiongroup]);

    /////////////////////////////////////////////////////////////////////////////////
    const isRefreshed = localStorage.getItem('isRefreshed');
    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            event.preventDefault();
            event.returnValue = '';
            localStorage.setItem('isRefreshed', 'true');
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(()=>{
        if(isRefreshed === 'true'){
          localStorage.setItem('isRefreshed', 'false');
          const isGroup = localStorage.getItem('waitingroomstatus');
          if(isGroup === 'group'){
            handleExit();
            return;
          }
          console.log("reconnected");
          socket.emit('rejoinwaitingroom', {recordid:recordid, gameid:gameid})
            // handleExit();
        }
    },[isRefreshed]);

///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////THIS IS ANIMATION////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
    const dooranimation = (flag:boolean) => {
        const closed = document.getElementById('door-closed');
        const exitsign = document.getElementById('exitsign');
        anime.remove(closed);
        anime.remove(open);
        anime.remove(exitsign);
        if (flag) {
          anime({
            targets: closed,
            duration: 500,
            easing: 'easeOutQuad',
            translateX: '-150%',
          });
          anime({
            targets: exitsign,
            duration: 1000,
            fontSize: '16px',
            opacity: 1,
            translateX: '240%',
            delay:100
          });
        } else {
          anime({
            targets: closed,
            duration: 500,
            color: '#233160',
            easing: 'easeOutQuad',
            scale: 1,
            translateX: '0%',
          });
      
          anime({
            targets: exitsign,
            duration: 750,
            fontSize: '12px',
            opacity: 0,
            translateX: '0%',
          });
        }
      };
      
      const startanimation = (flag:boolean) => {
        const playsign = document.getElementById('playsign');
        const startsign = document.getElementById('startsign');
        anime.remove(playsign);
        anime.remove(startsign);
        if (flag) {
          anime({
            targets: playsign,
            color: '#FAFAFA',
            scale: 1.5,
            duration: 500,
            easing: 'easeOutQuad',
            translateX: '100%',
          });
          anime({
            targets: startsign,
            duration: 1000,
            fontSize: '16px',
            opacity: 1,
            translateX: '-180%',
            delay:100
          });
        } else {
          anime({
            targets: playsign,
            duration: 500,
            color: '#233160',
            easing: 'easeOutQuad',
            scale: 1,
            translateX: '0%',
          });
      
          anime({
            targets: startsign,
            duration: 750,
            fontSize: '12px',
            opacity: 0,
            translateX: '0%',
          });
        }
      };
      

    const randomanimation = (flag:boolean) => {
        const randomtext = document.getElementById('random-text');
        const randomsign = document.getElementById('random-sign');
        anime.remove(randomtext);
        anime.remove(randomsign);
    
        if (flag) {
          anime({
            targets: randomtext,
            color: '#FAFAFA',
            duration: 500,
            translateX: '-20%',
            // translateX: '-15%',
            easing: 'easeOutQuad',
          });
          anime({
            targets: randomsign,
            opacity: 1,
            duration: 200,
            translateX: '100%',
            easing: 'easeOutQuad',
            delay:200,
            complete:function(){
              anime({
                targets:randomsign,
                rotate:'360deg',
                duration:2000,
                easing: 'easeOutQuad',
                loop:true
              })
            }
          });
        } else {
          anime({
            targets: randomtext,
            color: '#233160',
            duration: 500,
            translateX: '0%',
            easing: 'easeOutQuad',
          });
      
          anime({
            targets: randomsign,
            rotate: '0deg',
            duration: 0,
          });
      
          anime({
            targets: randomsign,
            opacity: 0,
            duration: 500,
            translateX: '0%',
            easing: 'easeOutQuad',
          });
        }
      };      

    const selectionanimation = (flag:boolean) => {
        const selectiontext = document.getElementById('selection-text');
        const selectionsign = document.getElementById('selection-sign');
        anime.remove(selectiontext);
        anime.remove(selectionsign);
        if (flag) {
        
            anime({
              targets: selectiontext,
              color: '#FAFAFA',
              duration: 500,
              translateX: '-20%',
              // translateX: '-15%',
              easing: 'easeOutQuad',
            });
            anime({
              targets: selectionsign,
              opacity: 1,
              duration: 200,
              translateX: '100%',
              easing: 'easeOutQuad',
              delay:200,
              complete:function(){
                anime({
                  targets:selectionsign,
                  rotate:'360deg',
                  duration:2000,
                  easing: 'easeOutQuad',
                  loop:true
                })
              }
            });
    } else {

        anime({
        targets: selectiontext,
        color: '#233160',
        duration: 500,
        translateX: '0%',
        easing: 'easeOutQuad',
        });
    
        anime({
        targets: selectionsign,
        rotate: '0deg',
        duration: 0,
        });
    
        anime({
        targets: selectionsign,
        opacity: 0,
        duration: 500,
        translateX: '0%',
        easing: 'easeOutQuad',
        });
    }
    };      
    const [hide, setHide] = useState(true);
    useEffect(() => {
        function checkWidth() {
            const width = window.innerWidth;
        
            if (width >= 1280) {
                setHide(true);
            }else{
                setHide(false);
            }
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => {
        window.removeEventListener('resize', checkWidth);
        };
    }, []);
    return (
        <div className="w-full h-screen bg-[#EDEFF7] flex flex-col overflow-y-auto hide-scroll">
            <WaitingRoomTitle game={game} />
            
            <div className="flex justify-between items-center">
                <div className=" min-[1280px]:w-full max-[1280px]:px-3 min-[1280px]:px-20 my-8">
                  {hide?(
                    <button 
                      onClick={handleExitConfirmation} 
                      className="bg-[#FAFAFA] w-36 h-12 py-1 px-1 rounded-3xl transition-all duration-500  relative shadow-md hover:shadow-inner flex items-center justify-center">
                        <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner">
                          <RiDoorClosedFill id='door-closed' className="text-3xl text-[#233160]"/>
                          <div id="exitsign" className=" mx-5 text text-[#233160] font-bold">Exit</div>
                        </span>
                    </button>
                  ):(
                    <button 
                      onClick={handleExitConfirmation} 
                      className="bg-[#FAFAFA] w-12 h-12 py-1 px-1 rounded-3xl relative shadow-md flex items-center justify-center">
                        <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner">
                          <RiDoorClosedFill id='door-closed' className="text-2xl text-[#233160]"/>
                        </span>
                    </button>
                  )}   
                </div>
                {isCreator && (
                <div className=" min-[1280px]:w-full max-[1280px]:px-3 min-[1280px]:px-20 flex justify-end items-center">
                    {game?.groupnumber === 1 ? (
                      <div>
                        {hide?(
                          <button onClick={handleStart} className="bg-[#FAFAFA] w-36 h-12 py-1 px-1 rounded-3xl transition-all duration-500  relative shadow-md hover:shadow-inner flex items-center justify-center">
                            <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                              <span id="startsign" className=" mx-5 text text-[#233160] font-bold">Start</span>
                              <RiPlayFill id='playsign' className="text-2xl text-[#233160]" />
                            </span>
                          </button>
                        ):(
                          <button onClick={handleStart} className="bg-[#FAFAFA] w-12 h-12 py-1 px-1 rounded-3xl relative shadow-md flex items-center justify-center">
                            <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                              <RiPlayFill id='playsign' className="text-2xl text-[#233160]" />
                            </span>
                          </button>
                        )}
                      </div>
                        
                        
                    ) : (
                        !groupbutton ? (
                            <div className="flex flex-col justify-center items-end gap-2">
                              <div>
                                {hide?(
                                  <button
                                      onClick={() => {handleRandomGroup(game?.groupnumber)}}
                                      onMouseEnter={() => {randomanimation(true)}}
                                      onMouseLeave={() => {randomanimation(false)}}
                                      className="px-1 py-1 w-56 h-12 rounded-3xl bg-[#FAFAFA] transition-all duration-500 hover:bg-[#233160]  hover:w-64 relative shadow-md flex items-center justify-center"
                                  >
                                    <span id="random-text" className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner">
                                      <span  className=" text-[#233160] font-bold">Set Random Group</span>
                                    </span>
                                      <RiSettings3Fill id='random-sign' className="opacity-0 text-2xl text-[#FAFAFA] absolute inset-0 my-auto ml-48" />
                                  </button>
                                ):(
                                  <button onClick={() => {handleRandomGroup(game?.groupnumber)}} className="bg-[#FAFAFA] w-12 h-12 py-1 px-1 rounded-3xl relative shadow-md flex items-center justify-center">
                                    <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                                      <RiShuffleFill className="text-2xl text-[#233160]"/>
                                    </span>
                                  </button>
                                )}
                              </div>
                              <div>
                                {hide?(
                                  <button
                                      onClick={() => {handleSelectionGroup(game?.groupnumber)}}
                                      onMouseEnter={() => {selectionanimation(true)}}
                                      onMouseLeave={() => {selectionanimation(false)}}
                                      className="px-1 py-1 w-56 h-12 rounded-3xl bg-[#FAFAFA] transition-all duration-500 hover:bg-[#233160]  hover:w-64 relative shadow-md flex items-center justify-center"
                                  >
                                    <span id="selection-text" className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner">
                                      <span className="text-[#233160] font-bold">Set Selection Group</span>
                                    </span>
                                      <RiSettingsFill id='selection-sign' className="opacity-0 text-2xl text-[#FAFAFA] absolute inset-0 my-auto ml-48" />
                                  </button>
                                ):(
                                  <button onClick={() => {handleSelectionGroup(game?.groupnumber)}} className="bg-[#FAFAFA] w-12 h-12 py-1 px-1 rounded-3xl relative shadow-md flex items-center justify-center">
                                    <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                                      <RiCursorFill className="text-2xl text-[#233160]"/>
                                    </span>
                                  </button>
                                )}
                              </div>
                                
                            </div>
                        ) : (
                          <div>
                            {hide?(
                              <button onClick={handleStart} className="bg-[#FAFAFA] w-36 h-12 py-1 px-1 rounded-3xl transition-all duration-500  relative shadow-md hover:shadow-inner flex items-center justify-center">
                                <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                                  <span id="startsign" className=" mx-5 text text-[#233160] font-bold">Start</span>
                                  <RiPlayFill id='playsign' className="text-2xl text-[#233160]"/>
                                </span>
                              </button>
                            ):(
                              <button onClick={handleStart} className="bg-[#FAFAFA] w-12 h-12 py-1 px-1 rounded-3xl relative shadow-md flex items-center justify-center">
                                <span className="bg-[#FAFAFA] w-full h-full  shadow-md flex items-center justify-center rounded-full active:shadow-inner" >
                                  <RiPlayFill id='playsign' className="text-2xl text-[#233160]"/>
                                </span>
                              </button>
                            )}
                          </div>
                        )
                    )}
                </div>
                )}
            </div>
            {!groupbutton ? ( 
                <WaitingRoomPlayers uuid={uuid} players={players} totalplayers={totalPlayers} />
            ) : random ? (
                <WaitingRoomMultiPlayers uuid={uuid} group={randomgroup} totalplayers={totalPlayers} /> 
            ) : (
                <WaitingRoomSelectionGroup playerid={uuid} players={players} groups={selectiongroup} totalplayers={totalPlayers}/>
            )}
           
            {/* Exit confirmation */}
            {exitConfirmation && (
                <DeleteConfirmation onConfirm={handleExit} onCancel={() => setExitConfirmation(false)} text={isCreator ? 'If you close or refresh the page, you will automatically kick all players and cancel the game' : 'If you close or refresh the page, you will automatically exit the game'} />
            )}
            {start && (<LoadingAnimationScreen/>)}
        </div>
        
    );
}
