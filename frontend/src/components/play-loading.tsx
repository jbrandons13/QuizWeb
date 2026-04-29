import anime from "animejs";
import { bouncy , leapfrog, dotWave, zoomies, tailspin, ring, dotStream} from "ldrs";
import { useEffect, useState } from "react";
import CountDownSFX from "../musics/countdown";

import ScoreSFX from "../musics/score1";
import { GroupResult, SingleResult } from "../dto/game.dto";
import { RiVipCrownLine } from "react-icons/ri";
bouncy.register();
leapfrog.register();
dotWave.register();
zoomies.register();
tailspin.register();
dotStream.register();
ring.register();
interface loadingProps{
    tag:string;
    currentQuestionNumber: number;
    totalQuestions: number;
    score:number;
    totalscore:number;
    groupnumber:number;
    groupscore:number;
    nomorequestion:boolean;
    loadingcond:number;
    phonemode:boolean;
    currentranking:SingleResult[];
    currentgroupranking:GroupResult[];
}
export default function LoadingPage({tag,currentQuestionNumber,totalQuestions, score, totalscore, groupnumber, groupscore, nomorequestion,loadingcond, phonemode, currentranking, currentgroupranking}:loadingProps): JSX.Element {
    console.log("the Loading screen",currentQuestionNumber, totalQuestions );
    const gametype = localStorage.getItem('gametype');
    const prevquestiontitle = localStorage.getItem('questiontitle');
    const prevquestionoption = localStorage.getItem('questionoption');
    const prevquestionplayeranswer = localStorage.getItem('questionplayeranswer');
    const prevquestionanswer = localStorage.getItem('questionanswer');
    const [bar1, setBar1] = useState('500');
    const [ring1, setRing1] = useState('100');
    const [stroke1, setStroke1] = useState('8');
    useEffect(() => {
        function checkWidth() {
            const width = window.innerWidth;
        
            if (width >= 550) {
                setBar1('1200');
                setRing1('100');
                setStroke1('8');
            }else{
                setBar1('350');
                setRing1('75');
                setStroke1('6');
            }
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => {
        window.removeEventListener('resize', checkWidth);
        };
    }, []);


    useEffect(()=>{
    
        if(loadingcond === 1){
            setCountdown(3);
            anime({
                targets:'#div6',
                easing:'easeOutQuad',
                duration:500,
                opacity:1,
                complete:function(){
                    setCountdownFlag(true);
                }
            })
        }
        if(loadingcond === 2){
            setCountdown(3);
            anime({
                targets:'#div1',
                opacity:1,
                easing:'easeOutQuad',
                duration:500,
                complete:function(){
                    anime({
                        targets:'#div2',
                        opacity:1,
                        easing:'easeOutQuad',
                        duration:500,
                        complete:function(){
                            anime({
                                targets:'#div3',
                                opacity:1,  
                                easing:'easeOutQuad',
                                duration:500,
                                complete:function(){
                                    anime({
                                        targets:'#div4',
                                        opacity:1,  
                                        easing:'easeOutQuad',
                                        duration:500,
                                        complete:function(){
                                            anime({
                                                targets:'#div5',
                                                opacity:1,  
                                                easing:'easeOutQuad',
                                                duration:500,
                                                complete:function(){
                                                    if(score !== 0){
                                                        ScoreSFX.playmusic();
                                                    }
                                                    document.querySelectorAll('.number-animate').forEach( (el) => {
                                                        const endValue = el.getAttribute('data-end-value');
                                                        const incrementValue = el.getAttribute('data-increment');
                                                        const durationValue = el.getAttribute('data-duration');
                                                        if (endValue) numberAnimation(el, endValue, incrementValue, durationValue);
                                                    });
                                                    function numberAnimation(el:any, endValue:any, incrementor:any, duration:any) {
                                                        anime({
                                                            targets: el,
                                                            textContent: endValue,
                                                            round: incrementor ? 1/incrementor : 1/5,
                                                            easing: 'easeInOutQuad',
                                                            duration: duration ? duration : 1000,
                                                            complete:function(){ScoreSFX.stopmusic()}
                                                        });
                                                    }
                                                    anime({
                                                        targets:['#divwait','#divnext'],
                                                        scale:[1,1.02,1],
                                                        duration:1000,
                                                        easing:'easeOutBack',
                                                        loop:true,
                                                        delay:1000
                                                    })
                                                    anime({
                                                        targets:'#div6',
                                                        opacity:1,
                                                        easing:'easeOutQuad',
                                                        duration:500,
                                                        delay:2000,
                                                        complete:function(){
                                                            setCountdownFlag(true);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }

                            })
                        }
                    })
                }
            })
        }
    },[]);

    // //for player
    // useEffect(()=>{
    //     console.log("")
    //     const loading = document.getElementById('loading');
    //     const scores = document.getElementById('scores');
    //     const countdowndiv = document.getElementById('countdowndiv');
    //     // if((tag !== 'creator' && currentQuestionNumber !== 0) || (tag !== 'creator' && totalQuestions === 0)){
    //         if(tag !== 'creator' && loadingcond === 2){   
    //             console.log("PLAYER 7 second LOADING PAGE");

    //         if(scores){scores.style.display = 'block'}
    //         setCountdown(3);
    //         anime({
    //             targets:loading,
    //             duration:500,
    //             easing:'easeOutQuad',
    //             opacity:1,
    //             delay:500,
    //             complete:function(){
    //                 Transition1SFX.playmusic();
    //                 anime({
    //                     targets:loading,
    //                     duration:500,
    //                     easing:'easeOutQuad',
    //                     translateY:gametype === 'single' ? '-130px':'-180px',
    //                     delay:500,
    //                     complete:function(){
    //                         anime({
    //                             targets:scores,
    //                             duration:500,
    //                             easing:'easeOutQuad',
    //                             opacity:1,
    //                             complete:function(){
    //                                 if(score !== 0){
    //                                     ScoreSFX.playmusic();
    //                                 }
    //                                 document.querySelectorAll('.number-animate').forEach( (el) => {
    //                                     const endValue = el.getAttribute('data-end-value');
    //                                     const incrementValue = el.getAttribute('data-increment');
    //                                     const durationValue = el.getAttribute('data-duration');
    //                                     if (endValue) numberAnimation(el, endValue, incrementValue, durationValue);
    //                                 });
    //                                 function numberAnimation(el:any, endValue:any, incrementor:any, duration:any) {
    //                                     anime({
    //                                         targets: el,
    //                                         textContent: endValue,
    //                                         round: incrementor ? 1/incrementor : 1/5,
    //                                         easing: 'easeInOutQuad',
    //                                         duration: duration ? duration : 1000,
    //                                         complete:function(){ScoreSFX.stopmusic()}
    //                                     });
    //                                 }
    //                                 setTimeout(() => {
    //                                     Transition2SFX.playmusic();
    //                                 }, 1300);
    //                                 anime({
    //                                     targets:scores,
    //                                     duration:500,
    //                                     easing:'easeOutQuad',
    //                                     translateX:phonemode?'-30px':'-100px',
    //                                     delay:1700,
    //                                     complete:function(){
    //                                         anime({
    //                                             targets:countdowndiv,
    //                                             duration:500,
    //                                             easing:'easeOutQuad',
    //                                             opacity:1,
    //                                             complete:function(){
                                                    
    //                                                 setCountdownFlag(true);
    //                                             }
    //                                         })
    //                                     }
    //                                 })
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    //     else if(tag !=='creator' && loadingcond === 1){
    //         console.log("PLAYER 3 second LOADING PAGE");

    //         if(scores){scores.style.display = 'none'}
    //         setCountdown(3);
    //         anime({
    //             targets:loading,
    //             duration:500,
    //             easing:'easeOutQuad',
    //             opacity:1,
    //             delay:500,
    //             complete:function(){
    //                 Transition1SFX.playmusic();
    //                 anime({
    //                     targets:loading,
    //                     duration:500,
    //                     easing:'easeOutQuad',
    //                     translateY:gametype === 'single' ? '-130px':'-180px',
    //                     delay:500,
    //                     complete:function(){
    //                         anime({
    //                             targets:countdowndiv,
    //                             duration:500,
    //                             easing:'easeOutQuad',
    //                             opacity:1,
    //                             complete:function(){
    //                                 setCountdownFlag(true);
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // },[]);
    // // for creator
    // useEffect(()=>{
    //     const loading = document.getElementById('loading');
    //     const countdowndiv = document.getElementById('countdowndiv');
    //     // if((tag === 'creator' && currentQuestionNumber !== 0) || (tag === 'creator' && totalQuestions === 0)){
    //     if(tag === 'creator' && loadingcond === 2){
    //         console.log("CREATOR 7 second LOADING PAGE");
    //         setCountdown(6);
    //         anime({
    //             targets:loading,
    //             duration:500,
    //             easing:'easeOutQuad',
    //             opacity:1,
    //             delay:500,
    //             complete:function(){
    //                 Transition1SFX.playmusic();
    //                 anime({
    //                     targets:loading,
    //                     duration:500,
    //                     easing:'easeOutQuad',
    //                     translateY:gametype === 'single' ? '-130px':'-180px',
    //                     delay:500,
    //                     complete:function(){
    //                         anime({
    //                             targets:countdowndiv,
    //                             duration:500,
    //                             easing:'easeOutQuad',
    //                             opacity:1,
    //                             complete:function(){
    //                                 setCountdownFlag(true);
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     }
    //     else if(tag ==='creator' && loadingcond === 1){
    //         console.log("CREATOR 3 second LOADING PAGE");
    //         setCountdown(3);
    //         anime({
    //             targets:loading,
    //             duration:500,
    //             easing:'easeOutQuad',
    //             opacity:1,
    //             delay:500,
    //             complete:function(){
    //                 Transition1SFX.playmusic();
    //                 anime({
    //                     targets:loading,
    //                     duration:500,
    //                     easing:'easeOutQuad',
    //                     translateY:gametype === 'single' ? '-130px':'-180px',
    //                     delay:500,
    //                     complete:function(){
    //                         anime({
    //                             targets:countdowndiv,
    //                             duration:500,
    //                             easing:'easeOutQuad',
    //                             opacity:1,
    //                             complete:function(){
    //                                 setCountdownFlag(true);
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // },[]);
    const [count, setCountdown] = useState(0);
    const [countdownflag, setCountdownFlag] = useState(false);

    useEffect(()=>{
        if(countdownflag){
            
            let interval:any;
    
            const startCountdown = () => {
                
                interval = setInterval(() => {
                    
                    setCountdown((prevCount) => {
                    if(prevCount === 3){
                        CountDownSFX.playmusic();
                    }
                    if (prevCount === 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCount - 1;
                    });
                    
                }, 1000);
            };
            
            startCountdown();
            
            return () => clearInterval(interval);
        }
    },[countdownflag]);

    useEffect(()=>{
        const countdown = document.getElementById('countdown');
        anime({
            targets: countdown,
            scale: [1],
            opacity:[0,1],
            easing: 'easeInOutQuad',
            duration: 1000,
            delay: 0,
            loop: false,
          });
    },[count]);

    
   
    return (
        <div className="w-full min-h-screen">     
            {loadingcond === 1 ? (
                <div className="w-full min-h-screen bg-[#EDEFF7] flex flex-col justify-center items-center gap-5">
                    <div className="flex justify-center items-center">
                        <l-dot-stream size="60"speed="2.5" color="#303C6C" ></l-dot-stream>
                        <div id="divstart" className="max-[550px]:text-xl min-[550px]:text-3xl font-light text-center">Starting the first Question</div>
                        <l-dot-stream size="60"speed="3" color="#303C6C" ></l-dot-stream>
                    </div>
                    <div className="flex flex-col items-center">
                        <div id="countdown" className=" max-[550px]:text-2xl min-[550px]:text-3xl font-bold">{count}</div>
                    </div>
                </div>
            ):(
                <div className="w-full min-h-screen bg-[#EDEFF7] flex flex-col justify-center items-center relative ">
                    {/* <Background/> */}
                    <div className="flex flex-col w-11/12 rounded-xl ">
                        <div id="div1" className=" opacity-0 text-center font text-3xl font-light tracking-[15px]">Previous Question</div>
                        {tag === 'player' && (
                            <div id="div2" className="opacity-0 flex gap-1 justify-center items-center tracking-[3px]">
                                <div>You answered</div>
                                <div className={` font-bold ${prevquestionanswer !== prevquestionplayeranswer ? 'text-[#C75F84]':'text-[#5DECBF]'}`}>{prevquestionanswer === prevquestionplayeranswer? 'Correctly':'Incorrectly'}</div>
                            </div>
                        )}
                        <div id="div3" className="opacity-0 flex flex-col bg-[#FAFAFA] rounded-3xl gap-2 border-2 p-10 my-4 shadow-md">
                            <div className="bg-[#303C6C] overflow-auto break-words rounded-3xl text-[#FAFAFA] text-center text-2xl px-5 py-10 shadow-md">{prevquestiontitle}</div>
                            <div className="bg-[#5DECBF] overflow-auto break-words rounded-3xl text-center text-xl px-5 py-5 shadow-md">{prevquestionoption}</div>
                        </div>
                    </div>
                    <div id="div4" className="opacity-0">
                        <l-zoomies size={bar1} stroke='5' bg-opacity='0' speed='3' color='black'></l-zoomies>
                    </div>
                    <div id="div5" className="opacity-0 flex max-[550px]:flex-col max-[550px]:gap-10 items-center justify-center w-full max-[550px]:px-5 min-[550px]:px-20 my-5">
                        {tag === 'player' && loadingcond === 2 && (
                            <div className="flex justify-center items-center max-[550px]:w-full min-[550px]:w-1/2 max-[550px]:text-md min-[550px]:text-2xl max-[550px]:gap-5 min-[550px]:gap-20">
                                <div className="flex flex-col justify-center items-center gap-1 ">
                                    <div className="font-light">Score</div>
                                    <div className="number-animate rounded-full bg-[#FAFAFA] px-10 py-2 shadow-md" data-end-value={score} data-increment="1" data-duration="1000">0</div>
                                </div>
                                {gametype === 'group' && (
                                    <div className="flex flex-col justify-center items-center gap-1">
                                        <div className="font-light text-center">Group Score</div>
                                        <div className="number-animate rounded-full bg-[#FAFAFA] px-10 py-2 shadow-md" data-end-value={groupscore} data-increment="1" data-duration="1000">0</div>
                                    </div>
                                )}
                            </div>
                        )}
                                        {/* {tag === 'creator' && loadingcond === 2 && (
                                            <div className="flex flex-col justify-center items-center font-light text-center max-[550px]:text-xl min-[550px]:text-2xl">
                                                <div>Current Ranking</div>
                                                <div>
                                                    {gametype ==='single' ?(
                                                        <div>
                                                            {currentranking.map((player, index) => (
                                                                index <3?(<div
                                                                    key={player.playerid}
                                                                    id={`single-player-${player.playerid}`} // Add an id to target each element
                                                                    className={`bg-[#FAFAFA] max-[550px]:w-72 min-[550px]:w-96 px-8 py-4 my-2 rounded-2xl max-[550px]:text-lg min-[550px]:text-2xl flex justify-between items-center shadow-md`}
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
                                                        </div>
                                                    ):(
                                                        <div>
                                                            {currentgroupranking.map((group, index) => (
                                                                index < 3 ? (
                                                                    <div
                                                                        key={group.groupid}
                                                                        id={`group-player-${group.groupid}`} // Add an id to target each element
                                                                        className={`bg-[#FAFAFA] max-[550px]:w-72 min-[550px]:w-96 px-8 py-4 my-2 rounded-2xl max-[550px]:text-lg min-[550px]:text-2xl flex justify-between items-center shadow-xl`}
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
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )} */}
                        <div className="flex flex-col justify-center items-center min-[550px]:w-1/2 max-[550px]:w-full"> 
                            <>
                                {nomorequestion ? (
                                    <div id="divwait" className="max-[550px]:text-xl min-[550px]:text-3xl font-light text-center">Waiting for the Final Result</div>
                                    ) : (
                                    <div className="flex flex-col gap-1 justify-center items-center max-[550px]:w-full">
                                        <div id="divnext" className=" font-light text-center max-[550px]:text-xl min-[550px]:text-2xl">Preparing the next question</div>
                                        <div className="max-[550px]:w-full max-[550px]:text-sm min-[550px]:text-2xl text-center font-bold rounded-full bg-[#FAFAFA]  px-10 py-2 shadow-md">Question {currentQuestionNumber} / Question {totalQuestions}</div>
                                    </div>
                                )}
                                
                            </>               
                        </div>
                    </div>
                    <div id="div6" className="opacity-0 flex flex-col items-center">
                        {/* <l-ring size={ring1} stroke={stroke1} bg-opacity='0' speed='2' color='black'></l-ring> */}
                        <div id="countdown" className=" max-[550px]:text-2xl min-[550px]:text-3xl font-bold">{count}</div>
                    </div>
                    
                </div>
            )}
        </div>

        // <div className="w-full h-full bg-[#EDEFF7] flex justify-center items-center relative">
        //     {/* <Background/> */}
        //     <div id='loading' className="flex flex-col justify-center items-center min-[550px]:w-[500px] h-[100px] opacity-0 absolute inset-0 m-auto"> 
        //         <>
        //             {nomorequestion ? (
        //                 <div className="max-[550px]:text-xl min-[550px]:text-3xl font-bold mb-5">Waiting for the Final Result</div>
        //             ) : (
        //                 <>
        //                     <div className="max-[550px]:text-lg min-[550px]:text-2xl font-bold">{currentQuestionNumber}/{totalQuestions}</div>
        //                     <div className="max-[550px]:text-xl min-[550px]:text-3xl font-bold mb-5">Loading</div>
        //                 </>
        //             )}
        //             <l-zoomies size={bar1} stroke='5' bg-opacity='0.1' speed='2' color='black'></l-zoomies>
        //         </>               
        //     </div>
            
        //     {tag !== 'creator' && (currentQuestionNumber !== 1 || (currentQuestionNumber === 1 && totalQuestions === 1)) && (
        //         <div id="scores" className="justify-center items-center max-[550px]:text-lg min-[550px]:text-2xl opacity-0">
        //             <div className="flex">
        //                 <div className="max-[550px]:w-[100px] min-[550px]:w-[150px]">Score</div>
        //                 <div>:</div>
        //                 <div className="number-animate ml-5" data-end-value={score} data-increment="1" data-duration="1000">0</div>
        //             </div>
        //             <div className="flex">
        //                 <div className="max-[550px]:w-[100px] min-[550px]:w-[150px]">Total Score</div>
        //                 <div>:</div>
        //                 <div className="number-animate ml-5" data-end-value={totalscore} data-increment="1" data-duration="1000">0</div>
        //             </div>
        //             {gametype === 'group' && (
        //                 <>  
        //                     <div className="flex">
        //                         <div className="max-[550px]:w-[100px] min-[550px]:w-[150px]">Group</div>
        //                         <div>:</div>
        //                         <div className=" ml-5">{groupnumber}</div>
        //                     </div>
        //                     <div className="flex">
        //                         <div className="max-[550px]:w-[100px] min-[550px]:w-[150px]">Group Score</div>
        //                         <div>:</div>
        //                         <div className="number-animate ml-5" data-end-value={groupscore} data-increment="1" data-duration="1000">0</div>
        //                     </div>
        //                 </>
                        
        //             )}
        //         </div>
                
        //     )}
        //     <div id="countdowndiv" className="flex flex-col items-center relative opacity-0">
        //         <l-ring size={ring1} stroke={stroke1} bg-opacity='0' speed='2' color='black'></l-ring>
        //         <div id="countdown" className="absolute max-[550px]:top-[20px] min-[550px]:top-[30px] max-[550px]:text-2xl min-[550px]:text-3xl font-bold">{count}</div>
        //     </div>
        // </div>
    );
}
