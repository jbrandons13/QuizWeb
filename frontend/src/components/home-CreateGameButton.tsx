import axios from "axios"
import { API_URL } from "../config/config"
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreateGameButton(): JSX.Element {

  const navigate = useNavigate();

  const handleCreateGame = async () => {
      const token = Cookie.get("token"); 
      if(!token){
        navigate('/');
      }
      try {

          const response = await axios.post(
          API_URL+'/game/', 
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420" 
            },
          }
        );
        const {uuid} = response.data;
        console.log("Game Creation is Successful");
        navigate(`/gamedetail/${uuid}/create`);
      } catch (error) {

        console.error(error);
      }
    };
  return(
      <div className="flex flex-col justify-center items-center">
          <button onClick={handleCreateGame} className="bg-[#FAFAFA] text-[#233160] font-bold w-64 py-2 my-5 rounded-2xl shadow-md border-[#202848] transition-all duration-150 hover:bg-[#202848] hover:text-[#FAFAFA]">Create</button>
          <div className  ="bg-[#202848] w-11/12 h-0.5"></div>
      </div>
  )
}