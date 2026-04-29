import anime from "animejs";
import { square } from "ldrs";
import { useEffect } from "react"
square.register();
interface Props{
    color:string
}
export default function Background({color}:Props):JSX.Element{
    const handleclick =()=>{
        anime({
            targets:"#test",
            width:'550px',
            height:'550px',
            duration:1000,
            easing:'linear'
        })
    }
    useEffect(()=>{
        // anime({
        //     targets: ["#test2",'#test'],
        //     width: ["500px", "505px"],
        //     height: ["500px", "505px"],
        //     duration: 1000,
        //     easing: "linear",
        //     direction: "alternate",
        //     loop: true
        //   });
    },[])

    
    return(
        <div className=" absolute overflow-hidden  w-full h-full ">
            <div className={`absolute top-[100px] text-center w-full max-[550px]:text-2xl min-[550px]:text-3xl font-bold text-[#${color}]`}>TheQz</div>
            
            <div id="test" className={`
                absolute 
                top-[200px] 
                -left-[300px] 
                transform 
                rotate-[30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
                
            />
            <div id="test" className={`
                absolute 
                -top-[250px] 
                -left-[40px] 
                transform 
                rotate-[30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
            />
            <div id="test2" className={`
                absolute 
                -bottom-[400px] 
                left-[50px] 
                transform 
                rotate-[30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
            />
            <div id="test21" className={`
                absolute 
                bottom-[50px] 
                left-[310px] 
                transform 
                rotate-[30deg] 
                border-[250px] 
                border-b-[#${color}] 
                border-t-transparent 
                border-r-transparent
                border-l-[#${color}] 
                opacity-10
                `}
            >
                {/* <div className=" absolute -top-1/2 -right-1/2 border-[249px] transform rotate-[-45deg] border-l-[#EDEFF7] border-t-transparent border-b-transparent border-r-transparent opacity-100"></div> */}
            </div>
            <div id="test3" className={`
                absolute 
                top-[200px] 
                -right-[300px] 
                transform 
                rotate-[-30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
            />
            <div id="test31" className={`
                absolute 
                bottom-[50px] 
                right-[310px] 
                transform 
                rotate-[-30deg] 
                border-[250px] 
                border-b-[#${color}] 
                border-t-transparent 
                border-l-transparent
                border-r-[#${color}] 
                opacity-10
                `}
            >
            {/* <div className=" absolute -top-1/2 -left-1/2 border-[249px] transform rotate-[-45deg] border-b-[#EDEFF7] border-t-transparent border-l-transparent border-r-transparent opacity-100"></div> */}

            </div>
            <div id="test4" className={`
                absolute 
                -bottom-[400px] 
                right-[50px] 
                transform 
                rotate-[-30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
            />
            <div id="test4" className={`
                absolute 
                -top-[250px] 
                -right-[40px] 
                transform 
                rotate-[-30deg] 
                w-[500px] 
                h-[500px] 
                bg-[#${color}]
                opacity-10
                `}
            />
            

        </div>
    )
}