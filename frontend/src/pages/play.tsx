import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../utils/socket";
import Cookie from 'js-cookie';
import LoadingPage from "../components/play-loading";
import QuestionPage from "../components/play-question";
import ResultPage from "../components/play-result";
import { QuestionAttributes } from "../dto/question.dto";
import { GroupResult, SingleResult } from "../dto/game.dto";
import { API_URL } from "../config/config";
import WRBGM from "../musics/waitingroommusic";
import QuestionSFX from "../musics/questionmsc";
import anime from "animejs";
import LoadingAnimationScreen from "../components/loadinganimation";
import LBGM from "../musics/loading1";
import PlaySetting from "../components/play-setting";
import { TurnOffAllSound } from "../musics/soundmanager";
import InitialPage from "../components/play-initiation";
import Background from "../components/backgroundeffect";

const PlayPage = (): JSX.Element => {
  useEffect(()=>{
      WRBGM.stopmusic();
  },[]);
  const [start, setStart] = useState(false);

  
  // const checkexistence = async () => {
  //   try {
  //     const response = await axios.get(API_URL+`/record/check/${gameid}`,{headers:{"ngrok-skip-browser-warning": "69420"}});
      
  //     if(response.data.text === 'error'){
  //       if(tag==='creator'){
  //         socket.emit('forceclosed', {recordid,gameid});
  //         setStart(true);
  //         setTimeout(() => {
  //           setStart(false);
  //           startTransition(()=>{navigate('/home');});
  //         }, 300);
  //       }
  //       if(tag === 'player'){
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
  //     const gamestatus = localStorage.getItem('gamestatus');
  //     if(gamestatus === 'playing'){
  //       checkexistence(); // Fetch updated game list every 10 seconds
  //     }
  //     // } 
  //   }, 5000);
  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);
  
  const navigate = useNavigate();
  const storedUserData = localStorage.getItem('userdata');
  const userdata = storedUserData ? JSON.parse(storedUserData) : {};
  const { recordid, gameid, tag, username, uuid } = userdata;
  const gametype = localStorage.getItem('gametype');
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(true);
  const [finish, setFinish] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionAttributes | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentScore, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [singleResult, setSingleResult] = useState<SingleResult[]>([]);
  const [groupResult, setGroupResult] = useState<GroupResult[]>([]);
  const [nomorequestion, setNoMoreQuestion] = useState(false);
  const [randomIndex, setRandomIndex] = useState(1);
  const [loadingCond, setLoadingCond] = useState(1);
  
  const forcestart = () =>{
    // console.log("GETTING THE QUESTION");
    socket.emit('getQuestion', {gametype, gameid, tag, recordid });
    // localStorage.removeItem('totalplayer');
    localStorage.removeItem('playercount');
  }
  const [stop, setStop] = useState(false);
  const forcenextquestion = () => {
    socket.emit('forcenextquestion', {recordid});
  } 

  const handleNewQuestion = async (data: {question: QuestionAttributes,currentQuestionNumber: number,totalQuestions: number,randomIndex: number}) => {
    const { question, currentQuestionNumber, totalQuestions, randomIndex } = data;
    // console.log('===New question received===', currentQuestionNumber, totalQuestions);
    setStop(false);
    setTimer(question.timer);
    setCurrentQuestion(question);
    setCurrentQuestionNumber(currentQuestionNumber);
    setTotalQuestions(totalQuestions);
    if(initial === true){
      setLoadingCond(1);
    }
    setLoading(true);
    setInitial(false);
    setRandomIndex(randomIndex);

    socket.emit('getcurrentscore', {gameid,recordid,gametype});

    QuestionSFX.stopmusic();
    LBGM.playmusic();
    let time = 0;
    if(currentQuestionNumber === 1){
      time = 5000;    
      setLoadingCond(1);

      // console.log("TIMER 7000");
    }
    else {
      time = 10000;
      setLoadingCond(2);
      // console.log("TIMER 10000");
    }

    setTimeout(() => {
      setLoading(false);
    }, time);
  };
  
  const handleSingleResult = async (data: { result: SingleResult[] }) => {
    // console.log('No more questions, Move to the Single result page in 3 seconds');
    setSingleResult(data.result);
    setNoMoreQuestion(true);
    setLoading(true);
    QuestionSFX.stopmusic();
    LBGM.playmusic();
    let time:number = 10000;
    setLoadingCond(2);
    // if(data.result.length === 0){
    //   time = 7000;
    //   setLoadingCond(1);
    // }

    setTimeout(() => {
      setFinish(true);
      setLoading(false);
    }, time);
  };
  const handleGroupResult = async (data: { result: GroupResult[] }) => {
    // console.log('No more questions, Move to the Group result page in 3 seconds');
    setGroupResult(data.result);
    setNoMoreQuestion(true);
    setLoading(true);
    QuestionSFX.stopmusic();
    LBGM.playmusic();
    let time = 10000;
    setLoadingCond(2);
    // if(data.result.length === 0){
    //   time = 7000;
    //   setLoadingCond(1)
    // }

    setTimeout(() => {
      setFinish(true);
      setLoading(false);
    }, time);
  };

  const handleForceNextQuestion = () =>{
    setStop(true);
    setTimer(0);
    setTimeout(() => {
      if(tag === 'creator'){
        // console.log("FORCE NEXT QUESTION ");
        socket.emit('getQuestion', {gametype, gameid, tag, recordid });
      }
    }, 3000);
  }

  const [current, setCurent] = useState('0');
  useEffect(()=>{
    if(tag === 'creator'){
      socket.on('newQuestion', handleNewQuestion);
      // const inittotalplayer = localStorage.getItem('totalplayer');
      // if(inittotalplayer === '0'){
      //   socket.emit('getQuestion', {gametype, gameid, tag, recordid });
      //   localStorage.removeItem('totalplayer');
      //   localStorage.removeItem('playercount');
      // }
      // else{
        socket.on('playercount', (data:{response:number}) =>{
          const {response} = data;
          const totalplayer = localStorage.getItem('totalplayer');
          console.log("PLAYERCOUNT : ", response);
          // const currentcount = localStorage.getItem('playercount');
          setCurent(response.toString());
          // if(totalplayer)setTotal(totalplayer);
          if(response.toString() === totalplayer){
            console.log("PLAYER ALL READY");
            socket.emit('getQuestion', {gametype, gameid, tag, recordid });
            // localStorage.removeItem('totalplayer');
          }
          // if(response && totalplayer){
          //   const updatedcount = parseInt(currentcount, 10) + 1;
          //   localStorage.setItem('playercount', updatedcount.toString());
          //   console.log('update the playercount:', updatedcount);
          //   if(totalplayer === updatedcount.toString()){
          //     // console.log("GETTING THE QUESTION");
          //     socket.emit('getQuestion', {gametype, gameid, tag, recordid });
          //     localStorage.removeItem('totalplayer');
          //     localStorage.removeItem('playercount');
          //   }
          // }
        });
      }
    // }                        
    return () => {
      socket.off('newQuestion', handleNewQuestion);
      socket.off('playercount');
    };
  },[]);

  useEffect(()=>{
    if(tag === 'player'){
      socket.on('newQuestion', handleNewQuestion);
      setTimeout(() => {
        socket.emit('ready', {recordid,uuid}); 
      }, 3000);
    }
    return () => {
      socket.off('newQuestion', handleNewQuestion);
    };
  },[]);

  useEffect(() => {
    socket.on('forceNQ', handleForceNextQuestion);
    socket.on('SingleResult', handleSingleResult);
    socket.on('GroupResult', handleGroupResult);
    // if(tag==='player'){
    // }
    return () => {
      // socket.off('newQuestion', handleNewQuestion);
      socket.off('forceNQ', handleForceNextQuestion);
      socket.off('SingleResult', handleSingleResult);
      socket.off('GroupResult', handleGroupResult);
    };
  }, [socket]);

  // useEffect(()=>{
  //   if(tag === 'creator'){
  //     setTimeout(() => {
  //       socket.emit('getQuestion', {gametype, gameid, tag, recordid });
  //     }, 1000);
  //   }
  // },[]);

  const [groupScore, setGroupScore] = useState(0);
  const [groupNumber, setGroupNumber] = useState(0);

  const [currentRanking, setCurrentRanking] = useState<SingleResult[]>([]);
  const [currentGroupRanking, setCurrentGroupRanking] = useState<GroupResult[]>([]);

  useEffect(() => {
    socket.on('score', (data: { playerid: string; score: number; totalscore: number }) => {
      const { playerid, score, totalscore } = data;
      if (playerid === uuid) {
        setScore(score);
        setTotalScore(totalscore);
      }
    });
    socket.on('groupscore', (data:{players:{playerid:string,username:string,score:number}[],groupnumber:number, groupscore:number})=>{
      const {players, groupnumber, groupscore} =data;
      const exist = players.find(player=> player.playerid === uuid);
      if(exist){
        setGroupNumber(groupnumber);
        setGroupScore(groupscore);
      }
    });
    if(tag==='creator'){
      socket.on('currentranking', (data:{result:SingleResult[]}) =>{
        console.log("CURRENT RESULT:", data.result);
        setCurrentRanking(data.result);
      });
  
      socket.on('currentgroupranking', (data:{result:GroupResult[]})=>{
        setCurrentGroupRanking(data.result);
      });
    }

  }, [currentQuestion]);

  useEffect(() => {
    const countdown = () => {
      if (!loading && !finish && !initial && !stop) {
        if (timer > -3) {
          setTimer(prevTimer => {
            const newTimer = prevTimer - 1;
            return newTimer;
          });
        } else {
          if(tag==="creator"){
            // console.log('Creator get the next question');
            socket.emit('getQuestion', {gametype, gameid, tag, recordid });
          }
        }
      }
    };
    const intervalId = setInterval(countdown, 1000);
    return () => clearInterval(intervalId);
  }, [timer, loading]);

  useEffect(()=>{
    if (!loading && !finish && !initial) {
      LBGM.stopmusic();
      QuestionSFX.playmusic(randomIndex);
    }
  },[loading]);

  // HANDLE REFRESH
  const isCreator = tag === 'creator';

  const handleExit = async () => {  
    if(document.fullscreenElement) {
      document.exitFullscreen().then(() => {}).catch((error) => {
      console.error('Error exiting fullscreen:', error);
      });
    }
    anime.remove('*');
    TurnOffAllSound();
    if (isCreator) {
      const token = Cookie.get('token');
      socket.emit("roomIsDeleted", { recordid, gameid });
      await axios.delete(API_URL + `/record/${recordid}/${gameid}`, { headers: { Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning": "69420" } });
      // console.log('room is deleted by creator');
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
      localStorage.removeItem('volume');
      // localStorage.removeItem('totalplayer');
      localStorage.removeItem('playercount');
      setStart(true);
      setTimeout(() => {
        setStart(false);
        startTransition(()=>{navigate('/home');});
      }, 300);
    } else if(tag ==='player'){
        socket.emit('disconnectFromPlay', {recordid})
        // console.log("player has exit from the room");
        localStorage.removeItem('userdata');
        localStorage.removeItem('isRefreshed');
        localStorage.removeItem('gametype');
        localStorage.removeItem('volume');
        setStart(true);
        setTimeout(() => {
          setStart(false);
          startTransition(()=>{navigate('/');});
        }, 300);
    }
    
  };

  const handleRoomDeleted = () => {
    if(document.fullscreenElement) {
      document.exitFullscreen().then(() => {}).catch((error) => {
      console.error('Error exiting fullscreen:', error);
      });
    }
    anime.remove('*');
    TurnOffAllSound();
    socket.emit('disconnectFromPlay', {recordid})
    
    setStart(true);
    setTimeout(() => {
      setStart(false);
      startTransition(()=>{navigate('/');});
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
      localStorage.removeItem('volume');
    }, 300);
  };

  const isRefreshed = localStorage.getItem('isRefreshed');
  useEffect(() => {
      const handleBeforeUnload = (event: any) => {
          localStorage.setItem('isRefreshed', 'true');
          event.preventDefault();
          event.returnValue = '';
          
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
      };
  }, []);

  useEffect(()=>{
    socket.on('roomDeleted', handleRoomDeleted);
    return () => {
      socket.off('roomDeleted', handleRoomDeleted);
  };
  },[]);

  useEffect(()=>{
    if(isRefreshed === 'true'){
      handleExit();
      // localStorage.setItem('isRefreshed', 'false');
    }
  },[isRefreshed]);

  const [phonemode, setPhoneMode] = useState(false);
    useEffect(() => {
      function checkWidth() {
          const width = window.innerWidth;
          if (width >= 550) {
              setPhoneMode(false);
          }else{
              setPhoneMode(true);
          }
      }
      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => {
      window.removeEventListener('resize', checkWidth);
      };
  }, []);
  const total = localStorage.getItem('totalplayer');
  return (
    <div className="w-full min-h-screen bg-[#EDEFF7] relative">
      {!phonemode && !loading && !finish && (
        <PlaySetting/>
      )}
      {loading ? (
        <>
          <LoadingPage
            tag={tag}
            currentQuestionNumber={currentQuestionNumber}
            totalQuestions={totalQuestions}
            score={currentScore}
            totalscore={totalScore}
            groupnumber={groupNumber}
            groupscore={groupScore}
            nomorequestion={nomorequestion}
            loadingcond={loadingCond}
            phonemode={phonemode}
            currentranking={currentRanking}
            currentgroupranking={currentGroupRanking}
          />
        </>
      ) : initial ?(
          <InitialPage forcestart={forcestart} tag={tag} current={current} total={total?total:'0'}/>
      ) : finish ? (
        <>
          <ResultPage singleData={singleResult} groupData={groupResult} />
        </>
      ) : (
        <>
          <QuestionPage
            question={currentQuestion}
            timer={timer}
            currentQuestionNumber={currentQuestionNumber}
            totalQuestions={totalQuestions}
            forcenextquestion={forcenextquestion}
          />
        </>
      )}
      {start && (<LoadingAnimationScreen/>)}
    </div>
  );
};

export default PlayPage;
