import { useEffect, useState } from "react";
import { QuestionAttributes } from "../dto/question.dto";
import socket from "../utils/socket";
import anime from "animejs";
import { useNavigate } from "react-router-dom";
import CountDownSFX from "../musics/countdown";
import ClickSFX from "../musics/click";
import PASFX from "../musics/playeranswer";
import PopSFX from "../musics/pop";

interface QuestionProps {
  question: QuestionAttributes | null;
  timer: number;
  currentQuestionNumber: number;
  totalQuestions: number;
  forcenextquestion: ()=>void;
}

export default function QuestionPage({
  question,
  timer,
  currentQuestionNumber,
  totalQuestions,
  forcenextquestion
}: QuestionProps): JSX.Element {

  // const isRefreshed = localStorage.getItem('isRefreshed');
    const navigate = useNavigate();
    // if(isRefreshed === 'true' || isRefreshed === null){
        // navigate('/');
    // }
  const storedUserData = localStorage.getItem('userdata');
  let userdata = null;
  if(storedUserData){
      userdata = JSON.parse(storedUserData); 
  }
  const {recordid,gameid,gamecode,tag,username,uuid} = userdata;
  const [answer, setAnswer] = useState<{number:number,duration:number}>({number:0,duration:0});
  const [counter, setCounter] = useState({ seconds: 0, milliseconds: 0 });
  const gametype = localStorage.getItem('gametype');
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => ({
        seconds: prevCounter.milliseconds >= 990 ? prevCounter.seconds + 1 : prevCounter.seconds,
        milliseconds: (prevCounter.milliseconds + 10)%1000, // Update every 10 milliseconds
      }));
    }, 10);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCounter({ seconds: 0, milliseconds: 0 });
  }, [question]);

  useEffect(()=>{
    if(timer<=0){
      if( tag !== 'creator'){
        handleAnswer(0);
      }
      checkAnswer();

    }
  },[timer])

  const handleAnswer = (index:number) => {
    if(answer.number === 0 && answer.duration === 0) {
      const duration = counter.seconds+(counter.milliseconds/1000);
      setAnswer({number:index, duration:duration});

      socket.emit('sendAnswer', {
        gametype:gametype,
        question:{
          uuid:question?.uuid,
          questiontitle:question?.questiontitle,
          option1:question?.option1,
          option2:question?.option2,
          option3:question?.option3,
          option4:question?.option4,
          answer:question?.answer,
          timer:question?.timer
        },
        player:{
          recordid:recordid, 
          gameid:gameid,
          gamecode:gamecode, 
          playerid:uuid,
          username:username,
          playeranswer:index,
          duration:duration,
        } 
      });
    }
  }

  const checkAnswer = () => {
    const correctIndex = question?.answer;
    const isCorrect = correctIndex === answer.number;
    const clock = document.getElementById('timer');
    const result = document.getElementById('result');
    const correctOption = document.getElementById(`option-${correctIndex}`);
    const selectedOption = document.getElementById(`option-${answer.number}`);

    anime({
      targets: clock,
      opacity: 0,
      duration: 700,
      delay:300,
      easing: 'easeInOutQuad',
      complete: () => {

        if(correctOption !== selectedOption){
          anime({
            targets: correctOption,
            backgroundColor: '#5DECBF', // Always change correctOption to green
            // color: '#fff',
            duration: 1000,
            easing: 'easeInOutQuad',
          });
        }    
        anime({
          targets: selectedOption,
          backgroundColor: isCorrect ? '#5DECBF' : '#C75F84',
          // color: '#fff',
          duration: 1000,
          easing: 'easeInOutQuad',
          complete:function(){
            //save the question answer to localstorage
            if(question){
              localStorage.setItem('questiontitle', question.questiontitle);
              localStorage.setItem('questionanswer', question.answer.toString());
              localStorage.setItem('questionplayeranswer', answer.number.toString());
              localStorage.setItem('questionoption', question[`option${question.answer.toString()}` as keyof QuestionAttributes].toString())
            }
          }
        });

      },
    });
  }

  const [playcountdown, setPlayCountDown] = useState(true);
  useEffect(() => {
    // Animation for changing the timer text using Anime.js
    const timernumber = document.getElementById('timernumber');
    if(timer <= 3 && timer !== 0){
      if(playcountdown){
        CountDownSFX.playmusic();
      }
      setPlayCountDown(false);
      anime({
        targets: timernumber,
        scale: [1.2, 1],
        opacity: [0, 1],
        color: ['#263157', '#ff0000'], // Example color transition, modify as needed
        duration: 500,
        easing: 'easeInOutQuad',
      });
    }

    if(timer === 0){
      anime.remove(['#questionbox','#blackbar','#option-1','#option-2','#option-3','#option-4']);
    }
  }, [timer]);  
  
  const [forcenext, setForceNext] = useState(false);
  const handleforcenext = ()=>{
    // if(timer > 3){
      console.log("clicked")
      setForceNext(true)
      forcenextquestion();
    // }
  }

  //animation

  useEffect(()=>{
    anime({
      targets:'#questionbox',
      scale:[0,1],
      borderRadius: ['48px', '24px'],
      duration:500,
      easing:'easeInQuad',
      delay:300,
      complete:function(){
        anime({
          targets:'#questionbox',
          scale:[1,1.01,1],
          duration:1200,
          easing:'easeOutBack',
          loop:true,
          delay:1500,
        })
      }
    })
  },[question]);

  useEffect(()=>{
    anime({
      targets:'#blackbar',
      width:['0','100%'],
      duration:1000,
      easing:'easeOutBack',
    })
  },[question]);
  
  useEffect(()=>{
    
    anime({
      targets:'#option-1',
      scale:[0,1],
      duration:750,
      easing:'easeInQuad',
      delay:300,
      complete:function(){
        anime({
          targets:'#option-1',
          scale:[1,1.01,1],
          duration:900,
          easing:'easeOutBack',
          loop:true,
          delay:1000,
        })
      }
    })

    anime({
      targets:'#option-2',
      scale:[0,1],
      duration:750,
      easing:'easeInQuad',
      delay:500,
      complete:function(){
        anime({
          targets:'#option-2',
          scale:[1,1.01,1],
          duration:900,
          easing:'easeOutBack',
          loop:true,
          delay:1000
        })
      }
    })
    anime({
      targets:'#option-3',
      scale:[0,1],
      duration:750,
      easing:'easeInQuad',
      delay:700,
      complete:function(){
        anime({
          targets:'#option-3',
          scale:[1,1.01,1],
          duration:900,
          easing:'easeOutBack',
          loop:true,
          delay:1000
        })
      }
    })
    anime({
      targets:'#option-4',
      scale:[0,1],
      duration:750,
      easing:'easeInQuad',
      delay:900,
      complete:function(){
        anime({
          targets:'#option-4',
          scale:[1,1.01,1],
          duration:900,
          easing:'easeOutBack',
          loop:true,
          delay:1000
        })
      }
    })
  },[question]);

  useEffect(()=>{
    anime({
      targets:'#timer',
      translateY:['-100px','0'],
      duration:500,
      easing:'easeOutQuad',
      delay:300,
      complete:function(){
        anime({
          targets:'#timer',
          scale:[1,1.3,1],
          duration:700,
          easing:'easeOutQuad',
        })
      }
    });
    anime({
      targets:'#questionnumberbox',
      translateY:['-100px','0'],
      duration:500,
      easing:'easeOutQuad',
      delay:600,
      complete:function(){
        anime({
          targets:'#questionnumberbox',
          scale:[1,1.3,1],
          duration:700,
          easing:'easeOutQuad',
        })
      }
    });
  },[question]);
  

  return (
    <div className="w-full min-h-screen bg-[#EDEFF7] flex flex-col max-[550px]:px-5 min-[550px]:px-20 ">
          <div className="p-4 mt-5 ">
            {/* <div className="text-xl font-bold mb-2 text-[#263157]">counter {counter.seconds}:{counter.milliseconds} answer {answer.number}-{answer.duration} </div> */}
            <div className="flex items-center justify-evenly">
              <div className={`font-semibold text-[#263157] 'opacity-100' text-center`} id="timer"><span id="timernumber" className="text-xl font-bold">{timer}</span> second(s) left</div>
              <div id="questionnumberbox" className=" flex flex-col justify-center items-center">
                <div className="font-semibold text-[#263157] text-lg">{currentQuestionNumber}/{totalQuestions}</div>
                {tag === 'creator' && (
                  <div onClick={()=>{timer>3 && !forcenext ? handleforcenext() : console.log("attemptFailed")}} className={`px-5 py-2 text-center shadow-md rounded-full active:shadow-inner transition-all duration-300 ${timer > 3?'cursor-pointer bg-[#FAFAFA]':forcenext?'cursor-wait bg-[#BEBEBE]':'cursor-not-allowed bg-[#BEBEBE]'}`}>NEXT QUESTION</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4">
              <div id="questionbox" className=" scale-0 overflow-auto break-words bg-[#303C6C] shadow-md px-10 py-16  text-2xl text-center font-bold text-[#FAFAFA]">{question?.questiontitle}</div>
              <div className="flex justify-center items-center my-6">
                <div id="blackbar" className  ="bg-[#202848] h-[3px] rounded-md "></div>
              </div>
              {tag !== 'creator' ? (
                <div className="flex flex-col gap-4 options text-center">
                  <div id="option-1" onClick={()=>{handleAnswer(1);PASFX.playmusic()}} className={`overflow-auto break-words text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md transition-all duration-300 ${answer.duration === 0 ?'bg-[#FAFAFA] hover:bg-[#BEBEBE]': answer.number === 1 ? 'bg-[#B4DFE5]':'bg-[#BEBEBE]'} `}>{question?.option1}</div>
                  <div id="option-2" onClick={()=>{handleAnswer(2);PASFX.playmusic()}} className={`overflow-auto break-words text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md transition-all duration-300 ${answer.duration === 0 ?'bg-[#FAFAFA] hover:bg-[#BEBEBE]': answer.number === 2 ? 'bg-[#B4DFE5]':'bg-[#BEBEBE]'} `}>{question?.option2}</div>
                  <div id="option-3" onClick={()=>{handleAnswer(3);PASFX.playmusic()}} className={`overflow-auto break-words text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md transition-all duration-300 ${answer.duration === 0 ?'bg-[#FAFAFA] hover:bg-[#BEBEBE]': answer.number === 3 ? 'bg-[#B4DFE5]':'bg-[#BEBEBE]'} `}>{question?.option3}</div>
                  <div id="option-4" onClick={()=>{handleAnswer(4);PASFX.playmusic()}} className={`overflow-auto break-words text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md transition-all duration-300 ${answer.duration === 0 ?'bg-[#FAFAFA] hover:bg-[#BEBEBE]': answer.number === 4 ? 'bg-[#B4DFE5]':'bg-[#BEBEBE]'} `}>{question?.option4}</div>
                </div>
              ):(
                <div className="flex flex-col gap-4 options text-center">
                  <div id="option-1"  className={`overflow-auto break-words bg-[#FAFAFA] text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md `}>{question?.option1}</div>
                  <div id="option-2"  className={`overflow-auto break-words bg-[#FAFAFA] text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md `}>{question?.option2}</div>
                  <div id="option-3"  className={`overflow-auto break-words bg-[#FAFAFA] text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md `}>{question?.option3}</div>
                  <div id="option-4"  className={`overflow-auto break-words bg-[#FAFAFA] text-[#263157] max-[550px]:p-2 min-[550px]:p-5 rounded-2xl shadow-md `}>{question?.option4}</div>
                </div>
              )}
              
          </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { QuestionAttributes } from "../dto/question.dto";
// import socket from "../utils/socket";
// import anime from "animejs";

// interface QuestionProps {
//   loading:boolean;
//   question: QuestionAttributes | null;
//   timer: number;
//   currentQuestionNumber: number;
//   totalQuestions: number;
// }

// export default function QuestionPage({
//   loading,
//   question,
//   timer,
//   currentQuestionNumber,
//   totalQuestions,
// }: QuestionProps): JSX.Element {

//   console.log("this is the QuestionPage");
//   const storedUserData = localStorage.getItem('userdata');
//   let userdata = null;
//   if(storedUserData){
//       userdata = JSON.parse(storedUserData); 
//   }
//   const {recordid,gameid,gamecode,tag,username,uuid} = userdata;
//   const [answer, setAnswer] = useState<{number:number,duration:number}>({number:0,duration:0});
//   const [counter, setCounter] = useState({ seconds: 0, milliseconds: 0 });
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCounter((prevCounter) => ({
//         seconds: prevCounter.milliseconds >= 990 ? prevCounter.seconds + 1 : prevCounter.seconds,
//         milliseconds: (prevCounter.milliseconds + 10)%1000, // Update every 10 milliseconds
//       }));
//     }, 10);

//     // Cleanup function to clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     setCounter({ seconds: 0, milliseconds: 0 });
//     setAnswer({number:0,duration:0});
//   }, [question]);

//   useEffect(()=>{
//     if(timer<=0){
//       handleAnswer(0);
//     }
//   },[timer])

//   const handleAnswer = (index:number) => {
//     if(answer.number === 0 && answer.duration === 0) {
//       const duration = counter.seconds+(counter.milliseconds/1000);
//       setAnswer({number:index, duration:duration});

//       socket.emit('sendAnswer', {
//         question:{
//           questiontitle:question?.questiontitle,
//           option1:question?.option1,
//           option2:question?.option2,
//           option3:question?.option3,
//           option4:question?.option4,
//           answer:question?.answer,
//           timer:question?.timer
//         },
//         player:{
//           recordid:recordid, 
//           gameid:gameid,
//           gamecode:gamecode, 
//           playerid:uuid,
//           username:username,
//           playeranswer:index,
//           duration:duration,
//         } 
//       });
//     }
//   }

//   return (
//     <div className="w-full h-screen bg-[#EDEFF7] flex flex-col">
      
//         <div className={` transition duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>

//           <div className="p-4">
//             <div className="text-xl font-bold mb-2 text-[#263157]">counter {counter.seconds}:{counter.milliseconds} answer {answer.number}-{answer.duration} </div>
//             <div className="flex justify-between">
//               <div className="font-semibold text-[#263157]">{timer} seconds left</div>
//               <div className="font-semibold text-[#263157]">
//                 {currentQuestionNumber}/{totalQuestions}
//               </div>
//             </div>
//           </div>

//         </div>

//           <div className="p-4">
//             <div id="questiontitle" className="overflow-auto break-words bg-[#303C6C] p-4 rounded-md shadow-md mb-4">
//               <div  className="text-2xl font-bold text-[#E5FEFF]">{question?.questiontitle}</div>
//               </div>
//               <div className="flex flex-col gap-4 options">
//                 <div id="option-1" onClick={()=>{handleAnswer(1)}} className={` text-[#263157] p-4 rounded-md shadow-md ${answer.number === 0 ?'bg-[#F7FFF7] hover:bg-[#88ABB2]': answer.number === 1 ? 'bg-[#B4DFE5]':'bg-[#ECF7F8]'} transition-all duration-500 ${loading? question?.answer === 1 ?'bg-[#57FD09]':answer.number === 1? 'bg-[#FF6B6B]':'opacity-0':''}`}>{question?.option1}</div>
//                 <div id="option-2" onClick={()=>{handleAnswer(2)}} className={` text-[#263157] p-4 rounded-md shadow-md ${answer.number === 0 ?'bg-[#F7FFF7] hover:bg-[#88ABB2]': answer.number === 2 ? 'bg-[#B4DFE5]':'bg-[#ECF7F8]'} transition-all duration-500 ${loading? question?.answer === 2 ?'bg-[#57FD09]':answer.number === 2? 'bg-[#FF6B6B]':'opacity-0':''}`}>{question?.option2}</div>
//                 <div id="option-3" onClick={()=>{handleAnswer(3)}} className={` text-[#263157] p-4 rounded-md shadow-md ${answer.number === 0 ?'bg-[#F7FFF7] hover:bg-[#88ABB2]': answer.number === 3 ? 'bg-[#B4DFE5]':'bg-[#ECF7F8]'} transition-all duration-500 ${loading? question?.answer === 3 ?'bg-[#57FD09]':answer.number === 3? 'bg-[#FF6B6B]':'opacity-0':''}`}>{question?.option3}</div>
//                 <div id="option-4" onClick={()=>{handleAnswer(4)}} className={` text-[#263157] p-4 rounded-md shadow-md ${answer.number === 0 ?'bg-[#F7FFF7] hover:bg-[#88ABB2]': answer.number === 4 ? 'bg-[#B4DFE5]':'bg-[#ECF7F8]'} transition-all duration-500 ${loading? question?.answer === 4 ?'bg-[#57FD09]':answer.number === 4? 'bg-[#FF6B6B]':'opacity-0':''}`}>{question?.option4}</div>
//               </div>
//           </div>
        
        
//       {loading &&(
//         <div className={` transition duration-300 ${!loading ? 'opacity-0' : ' opacity-100'}`}>
//           <div>Loading . . .</div>
//         </div>
//       )}
        
      
          
          

          
//     </div>
//   );
// }

