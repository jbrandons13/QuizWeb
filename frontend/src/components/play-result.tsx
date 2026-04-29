import { useNavigate } from "react-router-dom";
import { GameAttributes, GroupResult, SingleResult } from "../dto/game.dto";
import axios from "axios";
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import { useEffect, useState } from "react";
import { RiVipCrownLine } from "react-icons/ri";
import anime from "animejs";
import LBGM from "../musics/loading1";
import ResultSFX from "../musics/result1";
import ScoreSFX from "../musics/score1";
import { SoundManager, TurnOffAllSound } from "../musics/soundmanager";
interface ResultProps{
    singleData:SingleResult[];
    groupData:GroupResult[];
}
export default function ResultPage({singleData,groupData}:ResultProps): JSX.Element {
    const navigate = useNavigate();
    // const isRefreshed = localStorage.getItem('isRefreshed');
    // if(isRefreshed === 'true' || isRefreshed === null){
        // navigate('/');
    // }
    const storedUserData = localStorage.getItem('userdata');
    let userdata = null;
    if(storedUserData){
        userdata = JSON.parse(storedUserData); 
    }
    const {recordid,gameid,gamecode,tag,username,uuid} = userdata;
    const gametype = localStorage.getItem('gametype');
    
    const handler = async () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
            .then(() => {
            })
            .catch((error) => {
            console.error('Error exiting fullscreen:', error);
            });
        } else {
            console.warn('Document is not in fullscreen mode.');
        }
        if(tag==='player'){
            navigate('/');
            
        }else if(tag === 'creator'){
            const token = Cookie.get('token');
            await axios.post(API_URL+`/record/finish`, {recordid,gameid, gamecode}, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
            navigate('/home');
        }
        localStorage.removeItem('userdata');
        localStorage.removeItem('isRefreshed');
        localStorage.removeItem('gametype');
        localStorage.removeItem('volume');
        localStorage.removeItem('questiontitle');
        localStorage.removeItem('waitingroomtotalplayer');
        localStorage.removeItem('questionoption');
        localStorage.removeItem('questionanswer');
        localStorage.removeItem('questionplayeranswer');
        localStorage.removeItem('totalplayer');
        localStorage.removeItem('gamestatus');

        TurnOffAllSound();
    }
    const [player, setPlayer] = useState('');
    const [rank, setRank] = useState(0);
    const [groupnumber, setGroupNumber] = useState(0);
    const [score, setScore] = useState(0);
    useEffect(()=>{
        localStorage.setItem('gamestatus', 'finish');
        if(gametype === 'single'){
            const player = singleData.find(player=> player.playerid === uuid);
            if(player){
                setPlayer(player.username);
                setRank(player.ranking);
                setScore(player.score);
            }
            
        }else if(gametype === 'group'){
            const group = groupData.find(group=> group.players.find(player=>player.playerid === uuid)?.playerid === uuid);
            if(group){
                setGroupNumber(group.groupnumber);
                setRank(group.ranking);
                setScore(group.groupscore);
            }
        }
    },[]);

    useEffect(()=>{
        TurnOffAllSound();
        ResultSFX.playmusic();
        anime({
            targets:'#result',
            translateY: [-50, 0], // Example animation, you can adjust these values
            opacity: [0, 1],
            duration:500,
            delay: 500, // Delay based on the index for staggered animation
            easing: 'easeInOutSine',
        })
    },[]);
    useEffect(() => {
        // Animate each element in the singleData array
        singleData.forEach((player, index) => {
            anime({
                targets: `#${gametype}-player-${player.playerid}`, // Assuming each div has an id with playerid
                translateY: [-50, 0], // Example animation, you can adjust these values
                opacity: [0, 1],
                delay: (index * 500)+1000, // Delay based on the index for staggered animation
                easing: 'easeInOutSine', // Choose appropriate easing
                duration:500
            });
        });
    }, [singleData]);

    useEffect(() => {
        // Animate each element in the singleData array
        groupData.forEach((group, index) => {
            anime({
                targets: `#${gametype}-player-${group.groupid}`, // Assuming each div has an id with playerid
                translateY: [-50, 0], // Example animation, you can adjust these values
                opacity: [0, 1],
                delay: (index * 500)+1000, // Delay based on the index for staggered animation
                easing: 'easeInOutSine', // Choose appropriate easing
                duration:500
            });
        });
    }, [groupData]);

    useEffect(()=>{
        if(tag === 'creator'){
            anime({
                targets:'#exitbutton',
                opacity:1,
                duration:500,
                easing: 'easeInOutQuad',
                delay:gametype === 'single' ? (singleData.length > 3? 3:singleData.length-1)*500+2000: (groupData.length >3?3:groupData.length-1)*500+2000
            })
        }
        if(tag !== 'creator'){
            if(gametype === 'group'){
                anime({
                    targets: `#${gametype}-number`,
                    translateX: [-50,0],
                    opacity:[0,1],
                    delay:(groupData.length > 3?4:groupData.length+1)*500 + 1000,
                    easing: 'easeInOutSine'
                })
            }
            anime({
                targets:`#${gametype}-name`,
                scale:[0,1],
                duration:750,
                easing:'easeOutBack',
                delay:(groupData.length > 3?4:groupData.length+1)*500 + 1000,
                complete:function(){
                    anime({
                        targets:`#${gametype}-name-bar`,
                        width:['0px','260px'],
                        duration:1000,
                        easing:'easeOutBack',
                        complete:function(){
                            anime({
                                targets:`#${gametype}-name-val`,
                                translateY:['-55px','0'],
                                opacity:1,
                                duration:1000,
                                easing:'easeOutQuad',
                                complete:function(){
                                    anime({
                                        targets:`#${gametype}-name-bar`,
                                        width:['260px','0px'],
                                        opacity:[1,0],
                                        duration:1000,
                                        easing:'easeOutBack',
                                    })
                                }
                            })
                        }
                    })
                }
            })
            anime({
                targets:`#${gametype}-point`,
                scale:[0,1],
                duration:750,
                easing:'easeOutBack',
                delay:(groupData.length > 3?4:groupData.length+1)*500 + 1500,
                complete:function(){
                    anime({
                        targets:`#${gametype}-point-bar`,
                        width:['0px','260px'],
                        duration:1000,
                        easing:'easeOutBack',
                        complete:function(){
                            anime({
                                targets:`#${gametype}-point-val`,
                                translateY:['-55px','0'],
                                opacity:1,
                                duration:1000,
                                easing:'easeOutQuad',
                                complete:function(){
                                    if(score !== 0 ){
                                        ScoreSFX.playmusic();
                                    }
                                    anime({
                                        targets:`#${gametype}-point-val`,
                                        textContent: score,
                                        round: 1,
                                        easing: 'easeInOutQuad',
                                        duration: 1000,
                                        complete:function(){
                                            ScoreSFX.stopmusic();   
                                        }
                                    })
                                    anime({
                                        targets:`#${gametype}-point-bar`,
                                        width:['260px','0px'],
                                        opacity:[1,0],
                                        duration:1000,
                                        easing:'easeOutBack',
                                    })
                                }
                            })
                        }
                    })
                }
            })
            anime({
                targets:`#${gametype}-rank`,
                scale:[0,1],
                duration:750,
                easing:'easeOutBack',
                delay:(groupData.length > 3?4:groupData.length+1)*500 + 2000,
                complete:function(){
                    anime({
                        targets:`#${gametype}-rank-bar`,
                        width:['0px','260px'],
                        duration:1000,
                        easing:'easeOutBack',
                        complete:function(){
                            anime({
                                targets:`#${gametype}-rank-val`,
                                translateY:['-55px','0'],
                                opacity:1,
                                duration:1000,
                                easing:'easeOutQuad',
                                complete:function(){
                                    anime({
                                        targets:`#${gametype}-rank-bar`,
                                        width:['260px','0px'],
                                        opacity:[1,0],
                                        duration:1000,
                                        easing:'easeOutBack',
                                    })
                                }
                            })
                            anime({
                                targets:'#exitbutton',
                                opacity:1,
                                duration:500,
                                easing: 'easeInOutQuad',
                                ddelay:500,
                            })
                        }
                    })
                }
            })
            
            // anime({
            //     targets: `#${gametype}-rank`,
            //     translateX: [-50,0],
            //     opacity:[0,1],
            //     delay:gametype === 'single' ? (singleData.length-1)*500+2000: (groupData.length-1)*500+2000,
            //     easing: 'easeInOutSine',
            //     complete:function(){
            //         anime({
            //             targets:`#${gametype}-rank-val`,
            //             opacity: 1,
            //             easing: 'easeInOutQuad',
            //             duration: 1000
            //         })
            //     }
            // });
            // anime({
            //     targets: `#${gametype}-point`,
            //     translateX: [-50,0],
            //     opacity:[0,1],
            //     delay:gametype === 'single' ? (singleData.length-1)*500+3000: (groupData.length-1)*500+3000,
            //     easing: 'easeInOutSine',
            //     complete:function(){
            //         if(score !== 0 ){
            //             ScoreSFX.playmusic();
            //         }
            //         anime({
            //             targets:`#${gametype}-point-val`,
            //             textContent: score,
            //             round: 1,
            //             easing: 'easeInOutQuad',
            //             duration: 1000,
            //             complete:function(){
            //                 ScoreSFX.stopmusic();
                            
            //             }
            //         })
            //         anime({
            //             targets:'#exitbutton',
            //             opacity:1,
            //             duration:500,
            //             easing: 'easeInOutQuad',
            //             delay:500
            //         })
            //     }
            // });
        }
    },[score]);

    return (
        <div className="w-full min-h-screen bg-[#EDEFF7] py-10 flex flex-col justify-center items-center">
            <div id="result">
                <div  className={` text-3xl font-light tracking-[5px] my-5 text-center`}>Results</div>
                {singleData.length === 0 && groupData.length === 0 && (
                    <div className="flex justify-center items-center">
                        <div className=" text-gray-400 text-3xl font-bold">No Players Are Found</div>
                    </div>
                )}
            </div>
            
            {gametype === 'single'?(
                <>
                {singleData.map((player, index) => (
                    index <3?(<div
                        key={player.playerid}
                        id={`single-player-${player.playerid}`} // Add an id to target each element
                        className={`bg-[#FAFAFA] max-[550px]:w-72 min-[550px]:w-96 px-8 py-4 my-2 rounded-2xl max-[550px]:text-lg min-[550px]:text-2xl flex justify-between items-center shadow-md`}
                        style={{ opacity: 0 }} // Initially hide the elements before animation
                    >
                        <div className="flex items-center gap-x-2">
                            {index === 0 ? (
                                <RiVipCrownLine />
                            ) : (
                                <span className="text-center w-6">{index + 1}</span>
                            )}
                            {player.username.length > 15
                                ? `${player.username.slice(0, 15)}...`
                                : player.username}
                        </div>
                        {player.score}
                    </div>):null
                ))}
                {tag !== 'creator' && (
                    <div className="mt-5 flex flex-col gap-5">
                        <div className="flex flex-col items-center">
                            <div id="single-name" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[300px] pt-2 bg-[#EDEFF7]`}>Username</div>
                            <div className="z-10 flex justify-center items-center">
                                <div id="single-name-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                            </div>
                            <div id="single-name-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>{player.length > 15 ? `${player.slice(0, 15)}...` : player}</div>
                        </div>
                        <div className="flex max-[550px]:flex-col gap-5">   
                            <div className="flex flex-col items-center">
                                <div id="single-point" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[250px] pt-2 bg-[#EDEFF7]`}>Points</div>
                                    <div className="z-10 flex justify-center items-center">
                                        <div id="single-point-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                                    </div>
                                <div id="single-point-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>0</div>
                            </div> 
                            <div className="flex flex-col items-center">
                                <div id="single-rank" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[250px] pt-2 bg-[#EDEFF7]`}>Rank</div>
                                <div className="z-10 flex justify-center items-center">
                                    <div id="single-rank-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                                </div>
                                <div id="single-rank-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>{rank}</div>
                            </div>
                        </div>
                        {/* <div className={`text-2xl font-bold my-2`}>{player}</div> */}
                    </div>
                )}
                </>
            ):(
                <>
                {groupData.map((group, index) => (
                    index < 3 ? (
                        <div
                            key={group.groupid}
                            id={`group-player-${group.groupid}`} // Add an id to target each element
                            className={`bg-[#FAFAFA] max-[550px]:w-72 min-[550px]:w-96 px-8 py-4 my-2 rounded-2xl max-[550px]:text-lg min-[550px]:text-2xl flex justify-between items-center shadow-xl`}
                            style={{ opacity: 0 }} // Initially hide the elements before animation
                        >
                            <div className="flex items-center gap-x-2">
                                {index === 0 ? (
                                    <RiVipCrownLine />
                                ) : (
                                    <span className="text-center w-6">{index + 1}</span>
                                )}
                                Group {group.groupnumber}
                            </div>
                            {group.groupscore}
                        </div>
                    ):null
                ))}
                {tag !== 'creator' && (
                    
                    <div className="flex flex-col gap-5 mt-5">

                        <div className="flex flex-col items-center">
                            <div id="group-name" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[300px] pt-2 bg-[#EDEFF7]`}>Group</div>
                            <div className="z-10 flex justify-center items-center">
                                <div id="group-name-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                            </div>
                            <div id="group-name-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>Group {groupnumber}</div>
                        </div>
                        <div className="flex max-[550px]:flex-col gap-5">   
                            <div className="flex flex-col items-center">
                                <div id="group-point" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[250px] pt-2 bg-[#EDEFF7]`}>Points</div>
                                    <div className="z-10 flex justify-center items-center">
                                        <div id="group-point-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                                    </div>
                                <div id="group-point-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>0</div>
                            </div> 
                            <div className="flex flex-col items-center">
                                <div id="group-rank" className={` z-10 max-[550px]:text-lg min-[550px]:text-2xl font-light text-center w-[250px] pt-2 bg-[#EDEFF7]`}>Rank</div>
                                <div className="z-10 flex justify-center items-center">
                                    <div id="group-rank-bar" className  ="bg-[#202848] w-0 h-[3px] rounded-md "></div>
                                </div>
                                <div id="group-rank-val" className={` mt-1 z-0 bg-[#FAFAFA] max-[550px]:text-xl min-[550px]:text-2xl font-bold text-center rounded-full shadow-md w-[250px] px-10 py-2 opacity-0`}>{rank}</div>
                            </div>
                        </div>

                        {/* <div id="group-number" className="flex items-center opacity-0 h-[50px]">
                            <div className={`max-[550px]:text-lg min-[550px]:text-2xl font-bold max-[550px]:w-[100px] min-[550px]:w-[150px]`}>Group</div>
                            <div className="mx-5 font-bold">:</div>
                            <div className={`max-[550px]:text-xl min-[550px]:text-3xl font-bold max-[550px]:w-[100px] min-[550px]:w-[150px] text-right`}>Group {groupnumber}</div>
                        </div>
                        <div id="group-rank" className="flex items-center opacity-0 h-[50px]">
                            <div className={`max-[550px]:text-lg min-[550px]:text-2xl font-bold max-[550px]:w-[100px] min-[550px]:w-[150px]`}>Rank</div>
                            <div className="mx-5 font-bold">:</div>
                            <div id="group-rank-val" className={`max-[550px]:text-xl min-[550px]:text-3xl font-bold opacity-0 max-[550px]:w-[100px] min-[550px]:w-[150px] text-right`}>{rank}</div>
                        </div>
                        <div id="group-point" className="flex items-center opacity-0 h-[50px]">
                            <div className={`max-[550px]:text-lg min-[550px]:text-2xl font-bold max-[550px]:w-[100px] min-[550px]:w-[150px]`}>Point(s)</div>
                            <div className="mx-5 font-bold">:</div>
                            <div id="group-point-val" className={`max-[550px]:text-xl min-[550px]:text-3xl font-bold max-[550px]:w-[100px] min-[550px]:w-[150px] text-right`}>0</div>
                        </div> */}
                    </div>
                )}
                </>
            )}   
            <button id="exitbutton" onClick={handler} className={`bg-[#FF6B6B] px-10 py-2 rounded-xl my-10 opacity-0 transition-all duration-150 hover:bg-[#C55151]`}>{tag === 'creator'?'Save and Exit':"Exit"}</button>
        </div>
    );
}
