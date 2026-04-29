import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';
import { RiHome2Fill, RiLogoutBoxRLine } from "react-icons/ri";
import anime from "animejs";
import LoadingAnimationScreen from "./loadinganimation";
import { startTransition, useState, useTransition } from "react";

export default function Navbar():JSX.Element {
    const navigate = useNavigate();
    const [start, setStart] = useState(false);
    const handleLogoutButton = () => {
      setStart(true);
      setTimeout(() => {
        setStart(false);
        Cookie.remove('token');
        localStorage.removeItem("username");
        navigate('/');
      }, 300);
    }

    const backanimation = (flag:boolean) => {
      const backsign = document.getElementById('backsign');
      const backtext = document.getElementById('backtext');
      anime.remove(backsign);
      anime.remove(backtext);
      if (flag) {
        anime({
          targets: backsign,
          color: '#FAFAFA',
          scale: 1.1,
          duration: 500,
          easing: 'easeOutQuad',
          translateX: '-180%',
          // complete: () => {
          //   anime({
          //     targets: backtext,
          //     duration: 1000,
          //     fontSize: '16px',
          //     opacity: 1,
          //     translateX: '140%',
          //   });
          // },
        });
        anime({
            targets: backtext,
            duration: 1000,
            fontSize: '16px',
            opacity: 1,
            translateX: '170%',
            delay:200,
        });
          
      } else {
        anime({
          targets: backsign,
          duration: 500,
          color: '#FAFAFA',
          easing: 'easeOutQuad',
          scale: 1,
          translateX: '0%',
        });
    
        anime({
          targets: backtext,
          duration: 750,
          fontSize: '12px',
          opacity: 0,
          translateX: '0%',
        });
      }
    };

    const logoutanimation = (flag:boolean) => {
        const logoutsign = document.getElementById('logoutsign');
        const logouttext = document.getElementById('logouttext');
        anime.remove(logoutsign);
        anime.remove(logouttext);
        if (flag) {
          anime({
            targets: logoutsign,
            color: '#FAFAFA',
            scale: 1.1,
            duration: 500,
            easing: 'easeOutQuad',
            translateX: '150%',
            // complete: () => {
            //   anime({
            //     targets: logouttext,
            //     duration: 1000,
            //     fontSize: '16px',
            //     opacity: 1,
            //     translateX: '-110%',
            //   });
            // },
          });
          anime({
            targets: logouttext,
            duration: 1000,
            fontSize: '16px',
            opacity: 1,
            translateX: '-110%',
            delay:200
          });
        } else {
          anime({
            targets: logoutsign,
            duration: 500,
            color: '#FAFAFA',
            easing: 'easeOutQuad',
            scale: 1,
            translateX: '0%',
          });
      
          anime({
            targets: logouttext,
            duration: 750,
            fontSize: '12px',
            opacity: 0,
            translateX: '0%',
          });
        }
      };

    const username = localStorage.getItem("username");

    return (
      <>
        <nav className="bg-[#303C6C] mx-10 px-12 pt-4 pb-5 rounded-b-[30px] shadow-lg">
            <div className="flex justify-between items-center">
                <button
                    onClick={()=>{startTransition(()=>{navigate('/home')})}}
                    onMouseEnter={() => { backanimation(true) }}
                    onMouseLeave={() => { backanimation(false) }}
                    className="w-9 h-9 rounded-3xl border-2 border-[#FAFAFA] transition-all duration-500 hover:bg-[#1C2440]  hover:w-36 relative shadow-lg flex items-center"
                    >
                    <span id="backtext" className="opacity-0 text-[#FAFAFA] font-bold">Home</span>
                    <RiHome2Fill  id='backsign' className="text-lg text-[#FAFAFA] absolute inset-0 m-auto" />
                </button>
                <div className="text-[#FAFAFA] text-lg font-semibold ">{`${username}`}</div>
                {/* <div onClick={()=>{navigate('/home')}} className="text-[#FAFAFA] text-lg font-bold hover:cursor-pointer">My Dasboard</div> */}
                <button
                    onClick={handleLogoutButton}
                    onMouseEnter={() => { logoutanimation(true) }}
                    onMouseLeave={() => { logoutanimation(false) }}
                    className="w-9 h-9 rounded-3xl border-2 border-[#FAFAFA] transition-all duration-500 hover:bg-[#1C2440]  hover:w-36 relative shadow-lg flex items-center justify-end"
                    >
                    <span id="logouttext" className="opacity-0 text-[#FAFAFA] font-bold">Logout</span>
                    <RiLogoutBoxRLine id='logoutsign' className="text-lg text-[#FAFAFA] absolute inset-0 m-auto" />
                </button>
            </div>
        </nav>
        {start && (<LoadingAnimationScreen/>)}
      </>
    )
}