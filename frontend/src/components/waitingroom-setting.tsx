import anime from "animejs";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { RiFullscreenExitLine, RiFullscreenLine, RiVolumeDownFill, RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";
import {SoundManager} from "../musics/soundmanager";

export default function WaitingRoomSetting():JSX.Element{
    const [volume, setVolume] = useState(50); // Initial volume value
    useEffect(()=>{
        localStorage.setItem('volume',volume.toString());
        SoundManager(volume);
    },[])
    const handleVolumeChange = (e:any) => {
        const newVolume = e.target.value;
        localStorage.setItem('volume', newVolume);
        setVolume(newVolume);
        SoundManager(parseInt(newVolume));
        updateVolumeDisplay(newVolume);
      };
    
    const updateVolumeDisplay = (newVolume:string) => {
        const volumebarMute = document.getElementById('volumebarmute');
        const volumebarFull = document.getElementById('volumebarfull');

        if (newVolume === '0') {
            setMuted(false);
            if (volumebarMute && volumebarFull) {
            anime({
                targets: volumebarFull,
                opacity: 0,
                duration: 100,
                easing: 'linear',
            });
            anime({
                targets: volumebarMute,
                opacity: 1,
                duration: 100,
                easing: 'linear',
            });
            }
        } else {
            setMuted(true);
            if (volumebarMute && volumebarFull) {
            anime({
                targets: volumebarFull,
                opacity: 1,
                duration: 100,
                easing: 'linear',
            });
            anime({
                targets: volumebarMute,
                opacity: 0,
                duration: 100,
                easing: 'linear',
            });
            }
        }
    };
    const [muted, setMuted] = useState(true);
    const handleMuteToggle = () => {
        setMuted(!muted);
        if (!muted) {
            localStorage.setItem('volume', '50');
            setVolume(50);
            updateVolumeDisplay('50');
            SoundManager(50);
        }
        else{
            localStorage.setItem('volume', '0');
            setVolume(0);
            updateVolumeDisplay('0');
            SoundManager(0);
        }
    };
    // const [hover, setHover] = useState(false);
    // const handleHoverIn = () =>{
    //     anime.remove("*");
    //     setHover(true)
    //     anime({
    //         targets:'#container',
    //         width:'201px',
    //         duration:1000,
            
    //     })
    //     anime({
    //         targets:'#volumebar',
    //         opacity:1,
    //         duration:500,
    //         delay:100,
    //         easing:'easeOutQuad',
    //     })
    //     // const volumebar = document.getElementById('volumebar');
    //     // if(volumebar){
    //     //     volumebar.style.display = 'flex'
    //     // }
    // } 
    // const handleHoverOut = () =>{
    //     anime.remove("*");
    //     setHover(false);
    //     anime({
    //         targets:'#container',
    //         width:'48px',
    //         duration:1000,
            
    //     })
    //     anime({
    //         targets:'#volumebar',
    //         opacity:0,
    //         duration:500,
            
            
    //     })
    //     // const volumebar = document.getElementById('volumebar');
    //     // if(volumebar){
    //         // volumebar.style.display = 'none'
    //     // }
    // }
    const [fullscreen, setIsFullscreen] = useState(false);
    const handleFullscreen = () => {
        const elem = document.documentElement;
        if (!fullscreen) {
            // Enter fullscreen
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            }
            anime({
                targets:'#fullscreen',
                opacity:0,
                duration:100,
                easing:'linear'
            });
            anime({
                targets:'#notfullscreen',
                opacity:1,
                duration:100,
                easing:'linear'
            });
            setIsFullscreen(true);
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } 
            anime({
                targets:'#fullscreen',
                opacity:1,
                duration:100,
                easing:'linear'
            });
            anime({
                targets:'#notfullscreen',
                opacity:0,
                duration:100,
                easing:'linear'
            });
            setIsFullscreen(false);
        }
    }
    const [hide, setHide] = useState(true);
    useEffect(() => {
        function checkWidth() {
            const width = window.innerWidth;
        
            if (width >= 1280) {
                setHide(true);
            }else{
                setHide(false);
            }
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => {
        window.removeEventListener('resize', checkWidth);
        };
    }, []);
    return( 
        <div>
            {hide && (
                <>
                <div className="flex flex-col absolute bottom-0 left-0 mb-3 ml-10 gap-3">    
                    <div className=" w-12 cursor-pointer px-1 py-1 bg-[#FAFAFA] rounded-full shadow-md transition-all duration-500 hover:shadow-inner">
                        <div onClick={handleFullscreen} className="bg-[#FAFAFA] relative flex justify-center items-center h-10 w-10 shadow-md active:shadow-inner rounded-full">
                            <RiFullscreenExitLine id='notfullscreen' className='absolute opacity-0' />
                            <RiFullscreenLine id='fullscreen' className='absolute' />
                        </div>      
                    </div>
                    <div className="flex items-center bg-[#FAFAFA] w-[200px] rounded-full px-1 py-1">
                        <div className={` cursor-pointer relative flex justify-center items-center h-10 w-10 shadow-md  active:shadow-inner rounded-l-full`}>
                            <div onClick={handleMuteToggle} className=" flex relative w-full h-full justify-center items-center">
                                <RiVolumeMuteFill id='volumebarmute' className="absolute opacity-0 " />
                                <RiVolumeUpFill id='volumebarfull' className="absolute "/>
                            </div>
                            <div id="volumebar" className="flex justify-center items-center shadow-md active:shadow-inner rounded-r-full px-3 absolute left-full h-10 ">
                                <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className=" cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
        
        // <div className="flex absolute bottom-0 left-0 mb-3 ml-20 gap-3">    
        //     <div className="px-1 py-1 bg-[#FAFAFA] rounded-full shadow-md">
        //         <div onClick={handleFullscreen} onMouseLeave={handleHoverOut} className="bg-[#FAFAFA] relative flex justify-center items-center h-10 w-10 shadow-md active:shadow-inner rounded-full">
        //             <RiFullscreenExitLine id='notfullscreen' className='absolute opacity-0' />
        //             <RiFullscreenLine id='fullscreen' className='absolute' />
        //         </div>    
        //     </div>
        //     <div id="container" className="px-1 py-1 bg-[#FAFAFA] rounded-full shadow-md">
        //         <div onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} >
        //             <div className={`relative flex justify-center items-center h-10 w-10 shadow-md active:shadow-inner transition-all duration-100 ${hover?' rounded-l-full':'rounded-full'}`}>
        //                 <div onClick={handleMuteToggle} className="flex relative w-full h-full justify-center items-center">
        //                     <RiVolumeMuteFill id='volumebarmute' className="absolute opacity-0 " />
        //                     <RiVolumeUpFill id='volumebarfull' className="absolute "/>
        //                 </div>
        //                 <div id="volumebar" className="flex justify-center items-center shadow-md active:shadow-inner rounded-r-full px-3 absolute left-full h-10 ">
        //                     <input
        //                     type="range"
        //                     min="0"
        //                     max="100"
        //                     value={volume}
        //                     onChange={handleVolumeChange}
        //                     className=""
        //                     />
        //                 </div>
        //             </div>
        //         </div>
                
        //     </div>
        // </div>
    )
}