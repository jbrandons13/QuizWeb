import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/config";
import CreateGameButton from "../components/home-CreateGameButton";
import Navbar from "../components/navbar";
import GameList from "../components/home-GameList";
import { GameAttributes } from "../dto/game.dto";
import WRBGM from "../musics/waitingroommusic";
import QuestionSFX from "../musics/questionmsc";
import { TurnOffAllSound } from "../musics/soundmanager";

export default function Home():JSX.Element {
    useEffect(()=>{
      TurnOffAllSound();
      localStorage.removeItem('userdata');
      localStorage.removeItem('isRefreshed');
      localStorage.removeItem('gametype');
      localStorage.removeItem('volume'); 
      localStorage.removeItem('totalplayer');
      localStorage.removeItem('playercount');
      localStorage.removeItem('gamestatus');
    },[]);
    const token = Cookie.get("token");
    const navigate =useNavigate();

    useEffect(()=>{
        if(!token){
            navigate('/');
        }
    },[token, navigate]);

    const [gameList, setGameList] = useState<GameAttributes[]>([]);

    const deleteOneGame = (updatedGameList:GameAttributes[]) => {
        setGameList(updatedGameList);
    }

    const fetchGameList = async () => {
        try {
          const result = await axios.get(`${API_URL}/game/`, {
            headers: {
              Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "69420"
            }
          });
          setGameList(result.data);
        } catch (error) {
          if (error instanceof axios.AxiosError) {
            console.error('Error fetching game list:', error);
            // Handle the AxiosError here
          } else {
            // Handle other types of errors
            console.error('Non-Axios error occurred:', error);
          }
        }
      };

      useEffect(() => {
        fetchGameList(); // Initial fetch
    
        const intervalId = setInterval(() => {
          fetchGameList(); // Fetch updated game list every 10 seconds
        }, 5000);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, []);

    // useEffect(() => {
        
    //     const getGame = async () => {
    //         const result = await axios.get(API_URL+"/game/", {
    //             headers: {
    //                 Authorization: `Berear ${token}`
    //             }
    //         });
    //         // const gameTitles = result.data.map((obj: { gametitle: string; }) => obj.gametitle);
    //         const games = result.data;
    //         setGameList(games);
    //     }
    //     getGame();
    // }, []);
    
    return (
            <div className="w-full h-screen bg-[#EDEFF7] flex flex-col ">
                <Navbar />
                <CreateGameButton />
                <div className="overflow-y-auto pb-5 hide-scroll flex-1">
                    <GameList gamelist={gameList} deleteOneGame={deleteOneGame} />
                </div>
            </div>
    )
}