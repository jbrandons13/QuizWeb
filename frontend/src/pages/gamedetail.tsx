import { useEffect, useState } from "react";
import CreateQuestionButton from "../components/gamedetail-CreateQuestionButton";
import Navbar from "../components/navbar";
import UpdateGame from "../components/gamedetail-UpdateGame";
import Cookie from "js-cookie";
import axios from "axios";
import { API_URL } from "../config/config";
import { useNavigate, useParams } from "react-router-dom";
import QuestionList from "../components/gamedetail-question-list";
import { QuestionAttributes } from "../dto/question.dto";
import { GameAttributes } from "../dto/game.dto";

export default function GameDetail():JSX.Element{
    const [questionList, setQuestionList] = useState<QuestionAttributes[]>([]);
    const [game, setGame] = useState<GameAttributes>();
    const {uuid, action} = useParams();
    const navigate = useNavigate();
    const token = Cookie.get("token");
    useEffect(()=>{
        if(!token){
            navigate('/');
        }
    },[token, navigate]);
    useEffect(()=>{
        getQuestion();
        getGameById();
    },[]);

    const getQuestion = async () => {
        try {
            const result = await axios.get(API_URL+`/question/${uuid}`, {
                headers: {
                    Authorization: `Berear ${token}`,"ngrok-skip-browser-warning": "69420"
                }
            });
            const Questions = result.data;
            setQuestionList(Questions);
        } catch (error) {
            console.error(error);
        }
        
    }
    const getGameById = async () => {
        try {
            const result = await axios.get(API_URL+`/game/${uuid}`,{
                headers:{
                    Authorization: `Berear ${token}`,"ngrok-skip-browser-warning": "69420"
                }
            });
            const game = result.data;
            setGame(game);
        } catch (error) {
            console.error(error);
        }
    }

    const updateQuestionList  = (newQuestion:QuestionAttributes) =>{
        setQuestionList([...questionList,newQuestion]);
    }
    const deleteOneQuestion = (updatedQuestionList:QuestionAttributes[]) => {
        setQuestionList(updatedQuestionList);
    }
    
    
    return(
        <main className=" w-full h-screen bg-[#EDEFF7] ">
                
                <div className="flex flex-col h-full">
                    
                    <Navbar/>

                    {game && <UpdateGame game={game}/>}

                    {/* <div className="flex justify-center items-center">
                        <div className  ="bg-[#202848] w-11/12 h-0.5 "></div>
                    </div> */}
                    
                    <CreateQuestionButton updateQuestionList={updateQuestionList}/>

                    <div className="flex justify-center items-center mt-5">
                        <div className  ="bg-[#202848] w-11/12 h-0.5 "></div>
                    </div>

                    <div className=" w-full overflow-y-auto flex-1">
                        <QuestionList questions={questionList} deleteOneQuestion={deleteOneQuestion}/>
                    </div>
                    
                </div>
            
        </main>
    )
}