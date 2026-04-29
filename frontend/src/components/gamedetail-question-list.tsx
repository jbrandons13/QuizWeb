import axios from "axios";
import { API_URL } from "../config/config";
import { QuestionAttributes } from "../dto/question.dto";
import Cookie from 'js-cookie';
import { useState } from "react";
import anime from "animejs";
import { RiArrowLeftCircleLine, RiArrowRightCircleFill, RiArrowRightCircleLine, RiDeleteBin2Line } from "react-icons/ri";

interface QuestionListProps {
    questions: QuestionAttributes[];
    deleteOneQuestion:(updatedQuestionList:QuestionAttributes[]) => void;
  }

export default function QuestionList({questions, deleteOneQuestion }:QuestionListProps):JSX.Element{
    // const [index, setIndex] = useState(1);
    // const goToPreviousQuestion = () => {
    //     const container = document.getElementById('container');
    //     setIndex(prev=> prev !== 1? prev-1 : prev)
    //     if(container){
    //         console.log('prev');
    //         anime({
    //             targets: '#container',
    //             translateX: '0%', // Slide left by 100% of its width
    //             duration: 200, // Animation duration in milliseconds
    //             easing: 'linear' // Easing function
    //           });
    //     }
    // };

    // const goToNextQuestion = () => {
    //     const container = document.getElementById('container');
    //     setIndex(prev=> prev !== questions.length? prev+1 : prev)
    //     if(container && index !== questions.length){
    //         console.log("next");
    //         anime({
    //             targets: '#container',
    //             translateX: '-100%', // Slide left by 100% of its width
    //             duration: 200, // Animation duration in milliseconds
    //             easing: 'linear' // Easing function
    //           });
    //     }
    // };
    const handleDelete = async (uuid:string) =>{
        const token = Cookie.get("token");
        try {
            const response = await axios.delete(API_URL+`/question/${uuid}`,{headers:{Authorization: `Berear ${token}`,"ngrok-skip-browser-warning": "69420"}});
            const updatedQuestions = questions.filter((question)=>question.uuid !== uuid);
            deleteOneQuestion(updatedQuestions);
            
        } catch (error) {
            console.error(error);
            
        }
    }
    
    return (

        // <div className="flex flex-col my-5">
        //     <div className="flex justify-center items-center">
        //         <div>{index}/{questions.length}</div>
        //     </div>
        //     <div className="flex w-full overflow-x-hidden">
        //         <div className=" bg-[#EDEFF7] z-10 flex justify-center items-center">
        //         <button onClick={goToPreviousQuestion} className=" mx-10  rounded-3xl transition-all duration-200 hover:bg-[#263157]"><RiArrowLeftCircleLine className="text-[40px] text-[#263157] transition-all duration-200 hover:text-white"/></button>
        //         </div>
        //         <div id="container" className=" flex w-full">
        //             {questions.map((question, index)=>(
        //                 <div key={index} className=" flex-shrink-0 w-full px-5">

        //                     <div className="flex items-center gap-5 mt-5">
        //                         <div className="w-32 text-lg">Question Title</div>
        //                         <div>:</div>
        //                         <div 
        //                             className="flex-1 py-2 bg-[#F7FFF7] text-[#263157] px-2 border-2 border-[#58617F] rounded-2xl overflow-auto hide-scroll break-words">
        //                             {question.questiontitle}
        //                         </div>
        //                     </div>

        //                     <div className="flex gap-3 my-2 items-center">
        //                         <div className={`w-10 h-10 rounded-2xl  ${question.answer === 1? 'bg-[#314831]':'bg-[#F7FFF7] border-2 border-[#58617F]'}`}></div>
        //                         <div 
        //                             className="flex-1 py-2 bg-[#F7FFF7] text-[#263157] px-2 border-2 border-[#58617F] rounded-2xl overflow-auto hide-scroll break-words">
        //                             {question.option1}
        //                         </div>
        //                     </div>
        //                     <div className="flex gap-3 my-2 items-center">
        //                         <div className={`w-10 h-10 rounded-2xl  ${question.answer === 2? 'bg-[#314831]':'bg-[#F7FFF7] border-2 border-[#58617F]'}`}></div>
        //                         <div 
        //                             className="flex-1 py-2 bg-[#F7FFF7] text-[#263157] px-2 border-2 border-[#58617F] rounded-2xl overflow-auto hide-scroll break-words">
        //                             {question.option2}
        //                         </div>
        //                     </div>
        //                     <div className="flex gap-3 my-2 items-center">
        //                         <div className={`w-10 h-10 rounded-2xl  ${question.answer === 3? 'bg-[#314831]':'bg-[#F7FFF7] border-2 border-[#58617F]'}`}></div>
        //                         <div 
        //                             className="flex-1 py-2 bg-[#F7FFF7] text-[#263157] px-2 border-2 border-[#58617F] rounded-2xl overflow-auto hide-scroll break-words">
        //                             {question.option3}
        //                         </div>
        //                     </div>
        //                     <div className="flex gap-3 my-2 items-center">
        //                         <div className={`w-10 h-10 rounded-2xl  ${question.answer === 4? 'bg-[#314831]':'bg-[#F7FFF7] border-2 border-[#58617F]'}`}></div>
        //                         <div 
        //                             className="flex-1 py-2 bg-[#F7FFF7] text-[#263157] px-2 border-2 border-[#58617F] rounded-2xl overflow-auto hide-scroll break-words">
        //                             {question.option4}
        //                         </div>
        //                     </div>
        //                     <div className="flex justify-between my-2">
        //                         <div className="flex gap-5">
        //                             <div className="flex justify-center items-center text-lg w-32 text-[#263157]"><span className="w-full">Timer (sec)</span></div>
        //                             <div className="flex justify-center items-center text-lg">:</div>
        //                             <div className="bg-[#F7FFF7] border-2 border-[#58617F] w-36 h-10 px-3 rounded-2xl text-md flex justify-center items-center"><span className="w-full text-center text-[#263157]">{question.timer}</span></div>
        //                         </div>
        //                         <button onClick={()=>{handleDelete(question.uuid)}} className="bg-[#FF6B6B] w-28 h-10 px-3 rounded-xl text-md text-center transition-all duration-150 hover:bg-[#C55151]">Delete</button>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //         <div className="bg-[#EDEFF7] z-10 flex justify-center items-center">
        //             <button onClick={goToNextQuestion} className=" mx-10  rounded-3xl transition-all duration-200 hover:bg-[#263157]"><RiArrowRightCircleLine className="text-[40px] text-[#263157] transition-all duration-200 hover:text-white"/></button>
        //         </div>
        //     </div>
            
        // </div>
        <>
        {questions.length === 0 && (
            <div className="flex h-full justify-center items-center">
              <div className=" text-gray-400 max-[550px]:text-3xl min-[550px]:text-5xl font-bold text-center">No Questions Are Found</div>
            </div>
          )}
        <div id="container" className=" flex flex-col w-full justify-center items-center hide-scroll">
            {questions.map((question, index)=>(
                <div key={index} className=" w-5/6 max-[550px]:px-5 min-[550px]:px-20 max-[550px]:py-4 min-[550px]:py-8 my-4 rounded-[40px] shadow-lg bg-[#FAFAFA]">
                    <div className="flex items-center gap-5 max-[550px]:mb-1 min-[550px]:mb-5">
                        <div className="min-[550px]:w-32 max-[550px]:text-md min-[550px]:text-lg font-bold text-[#263157]">Question</div>
                        <div className="font-bold max-[550px]:text-md min-[550px]:text-lg">:</div>
                        <div 
                            className="flex-1 py-2 bg-[#F2F2F2] shadow-md text-[#263157] px-2 rounded-2xl overflow-auto hide-scroll break-words">
                            {question.questiontitle}
                        </div>
                    </div>
                    <div className="flex gap-3 my-2 items-center max-[550px]:text-sm">
                        <div className={`max-[550px]:w-9 min-[550px]:w-10 max-[550px]:h-9 min-[550px]:h-10 rounded-2xl shadow-md ${question.answer === 1? 'bg-[#FF6B6B]':'bg-[#F2F2F2]'}`}></div>
                        <div 
                            className="flex-1 py-2 bg-[#F2F2F2] shadow-md text-[#263157] px-2 rounded-2xl overflow-auto hide-scroll break-words">
                            {question.option1}
                        </div>
                    </div>
                    <div className="flex gap-3 my-2 items-center max-[550px]:text-sm">
                        <div className={`max-[550px]:w-9 min-[550px]:w-10 max-[550px]:h-9 min-[550px]:h-10 rounded-2xl shadow-md ${question.answer === 2? 'bg-[#FF6B6B]':'bg-[#F2F2F2]'}`}></div>
                        <div 
                            className="flex-1 py-2 bg-[#F2F2F2] shadow-md text-[#263157] px-2 rounded-2xl overflow-auto hide-scroll break-words">
                            {question.option2}
                        </div>
                    </div>
                    <div className="flex gap-3 my-2 items-center max-[550px]:text-sm">
                        <div className={`max-[550px]:w-9 min-[550px]:w-10 max-[550px]:h-9 min-[550px]:h-10 rounded-2xl shadow-md ${question.answer === 3? 'bg-[#FF6B6B]':'bg-[#F2F2F2]'}`}></div>
                        <div 
                            className="flex-1 py-2 bg-[#F2F2F2] shadow-md text-[#263157] px-2 rounded-2xl overflow-auto hide-scroll break-words">
                            {question.option3}
                        </div>
                    </div>
                    <div className="flex gap-3 my-2 items-center max-[550px]:text-sm">
                        <div className={`max-[550px]:w-9 min-[550px]:w-10 max-[550px]:h-9 min-[550px]:h-10 rounded-2xl shadow-md ${question.answer === 4? 'bg-[#FF6B6B]':'bg-[#F2F2F2]'}`}></div>
                        <div 
                            className="flex-1 py-2 bg-[#F2F2F2]  shadow-md text-[#263157] px-2 rounded-2xl overflow-auto hide-scroll break-words">
                            {question.option4}
                        </div>
                    </div>
                    <div className="flex justify-between max-[550px]:mt-1 min-[550px]:mt-5">
                        <div className="flex gap-5 ">
                            <div className="flex justify-center items-center max-[550px]:text-md min-[550px]:text-lg min-[550px]:w-32 text-[#263157] font-bold"><span className="w-full">Timer (sec)</span></div>
                            <div className="flex justify-center items-center max-[550px]:text-md min-[550px]:text-lg font-bold">:</div>
                            <div className="bg-[#F2F2F2] shadow-md min-[550px]:w-36 h-10 px-3 rounded-2xl text-md flex justify-center items-center"><span className="w-full text-center text-[#263157]">{question.timer}</span></div>
                        </div>
                        <button onClick={()=>{handleDelete(question.uuid)}} className="bg-[#FF6B6B] text-[#FAFAFA] shadow-md w-20 h-10 px-3 rounded-xl text-md text-center transition-all duration-150 hover:bg-[#C55151] font-bold flex justify-center items-center"><RiDeleteBin2Line className=' text-2xl' /></button>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}