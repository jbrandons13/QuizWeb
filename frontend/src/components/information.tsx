import anime from "animejs";
import { square } from "ldrs";
import { useEffect, useState } from "react"
import { RiArrowDropRightFill, RiArrowRightSFill, RiGamepadFill, RiGamepadLine, RiHeart2Fill, RiHeart2Line, RiToolsFill, RiUser3Fill } from "react-icons/ri";
square.register();
export default function Information():JSX.Element{
    useEffect(()=>{

        anime({
            targets:'#background',
            translateY: ['-5px', '5px'], // Move the element up and down by 10px
            easing: 'easeInOutSine',
            duration:2000,
            direction:'alternate',
            loop:true
        })
    },[]);
    // const [value, setValue] = useState(60);
    // const [flag, setFlag] = useState(false);
  
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     if (value >= 90) {
    //       setFlag(true);
    //     }
    //     if (value < 60) {
    //       setFlag(false);
    //     }
    //     setValue((prevValue) => (flag ? prevValue - 10 : prevValue + 10));
    //   }, 10);
  
    //   return () => clearInterval(interval);
    // }, [value, flag]); // Add dependencies: value and flag
  
    // useEffect(() => {
    //   console.log(value); // Log the updated value whenever it changes
    // }, [value]); // Add value as a dependency to this useEffect
  
    return(
        <div className="flex max-[550px]:justify-center absolute overflow-hidden w-full h-full text-[#303C6C]">
            <div id="background" className={`
            max-[550px]:px-5 min-[550px]:px-12 
            max-[550px]:py-2 min-[550px]:py-12        
            min-[550px]:mx-20 
            max-[550px]:top-[340px] min-[550px]:top-[100px] 
            max-[550px]:w-11/12 min-[550px]:w-[400px] 
            min-[550px]:h-[550px]
            flex flex-col justify-center items-center absolute bg-[#FAFAFA] bg-opacity-70 rounded-3xl border-[5px]  border-[#303C6C]`}>
             <div className="flex items-center gap-1 justify-center font-extrabold text-xl text-center"><RiGamepadLine />Welcome to TheQz<RiGamepadLine /></div>
             <div className="text-center font-bold">Real-time Quiz Platform</div>
             <div className="max-[550px]:my-2 min-[550px]:my-4 w-full font-semibold">
                <div className="flex items-center font-bold gap-1"><RiHeart2Line />For Players</div>
                <div className="mb-1 font-semibold text-sm">Join the fun hassle-free!</div>
                <div className="flex items-center gap-1"><RiArrowRightSFill />No sign-up required!</div>
                <div className="flex items-center gap-1"><RiArrowRightSFill />Enter the<span className="font-bold">gamecode</span></div>
                <div className="mb-1 flex items-center gap-1"><RiArrowRightSFill />Choose your<span className="font-bold">username</span></div>
                <div className="text-[#FFA500] text-sm text-justify font-semibold">"Important: Refreshing the page during a game will lead to being kicked out. Stay in the action and avoid refreshing for uninterrupted gameplay!"</div>
             </div>
             <div className=" w-full font-semibold">
                <div className="flex items-center font-bold gap-1"><RiHeart2Line />For Creators</div>
                <div className="mb-1 font-semibold text-sm">Unleash your creativity!</div>
                <div className="flex items-center gap-1"><RiArrowRightSFill />Sign-up is required!</div>
                <div className="flex items-center gap-1"><RiArrowRightSFill />Create, edit, and delete games</div>
                <div className="flex items-center gap-1"><RiArrowRightSFill />Track and see the game records</div>
                <div className="mb-1 flex items-center gap-1"><RiArrowRightSFill />Manage your games easily</div>
             </div>
            </div>
        </div>
    )
}