import { useState, useEffect } from "react"
import socket from "../utils/socket";
import { PlayerAttributes } from "../dto/player.dto";
import anime from "animejs";

interface Props{
    playerid: string;
    players: PlayerAttributes[];
    groups: PlayerAttributes[][];
    totalplayers:number;
}
export default function WaitingRoomSelectionGroup({ playerid, players, groups, totalplayers}:Props):JSX.Element{
    const storedUserData = localStorage.getItem('userdata');
    let userdata = null;
    if (storedUserData) {
        userdata = JSON.parse(storedUserData); 
    }
    const {recordid, gameid, gamecode, tag, username, uuid} = userdata || {};

    const handleSlotClick = (groupIndex: number, slotIndex: number, username: string, uuid: string) => {
        if(tag !== 'creator'){
          if(groups[groupIndex][slotIndex].username === '' && groups[groupIndex][slotIndex].uuid === ''){
            // const slot = document.getElementById(`slot-${groupIndex}-${slotIndex}`);
            // slot?.removeAttribute('style');
            // anime.remove(`#slot-${groupIndex}-${slotIndex}`)
            anime.remove('.empty-slot')
            
            socket.emit('updateSelectionGroup', {recordid, gameid, groups, groupIndex,slotIndex,username,uuid});
          }
        }
    };

    const handleDragStart = (e:any, player:PlayerAttributes) => {
      if (tag === 'creator') {
        e.dataTransfer.setData('player', JSON.stringify(player));
      } else {
        // Prevent dragging for non-creator users
        e.preventDefault();
      }
    };
    
    const handleDragOver = (e:any) => {
      e.preventDefault();
    };
    
    const handleDrop = (e:any, groupIndex:number, slotIndex:number) => {
      e.preventDefault();
      const player = JSON.parse(e.dataTransfer.getData('player'));
      if(groups[groupIndex][slotIndex].username === '' && groups[groupIndex][slotIndex].uuid === ''){
        socket.emit('updateSelectionGroup', {recordid, gameid, groups, groupIndex,slotIndex,username:player.username,uuid:player.uuid});
      }
    };

    useEffect(()=>{
      anime({
        targets:'.empty-slot',
        scale:[1,1.02,1],
        duration:900,
        easing:'easeOutBack',
        loop:true,
        delay:1000
      })

    },[groups]);

    return(
        <div className="flex flex-col">
          <div className="flex flex-col justify-center w-full items-center relative my-5">
              <div className="bg-[#FAFAFA] w-11/12 h-[5px] rounded-md shadow-md "></div>
              <div className="font-bold text-center bg-[#FAFAFA] w-64 py-3 rounded-xl absolute bottom-0 min-[550px]:left-0 mx-10 transform translate-y-1/2 shadow-md">Not In Group : {totalplayers}</div>
          </div>
          <div className="flex gap-2 px-10 py-2 my-5 overflow-x-auto hide-scroll">
            {players.map((player, index) => (
                <div
                key={index}
                draggable
                onDragStart={(e)=>handleDragStart(e, player)}
                className={` flex-shrink-0  w-56 px-4 py-2 text-center bg-[#FAFAFA] ${uuid===player.uuid?'text-[#F4976C] border-2 border-[#F4976C]':'text-[#686C8C] border-2 border-[#686C8C]'} rounded-2xl ${tag === 'creator' ? 'hover:cursor-grab active:cursor-grabbing':''}`}
                >
                {player.username.length > 15 ? `${player.username.slice(0, 15)}...` : player.username}
                </div>
            ))}
          </div>
          <div className="flex flex-col justify-center w-full items-center relative mt-6 mb-10">
              <div className="bg-[#FAFAFA] w-11/12 h-[5px] rounded-md shadow-md"></div>
              <div className="font-bold text-center bg-[#FAFAFA]  w-64 py-3 rounded-xl absolute bottom-0 min-[550px]:left-0 mx-10 transform translate-y-1/2 shadow-md">Groups</div>
          </div>
          <div className=" w-full my-5 flex flex-wrap max-[550px]:justify-center gap-6 px-10">
            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="bg-[#303C6C] rounded-lg w-64 text-center px-5 pt-1 pb-3 shadow-md">
                  <div className="text-[#FAFAFA] tracking-widest font-light">Group {groupIndex + 1}</div>
                  <div>
                    {group.map((slot, slotIndex) => (
                      <div 
                      id={`slot-${groupIndex}-${slotIndex}`}
                      key={slotIndex} 
                      onDragOver={(e)=>{handleDragOver(e)}}
                      onDrop={(e)=>handleDrop(e,groupIndex, slotIndex)}
                      onClick={() => handleSlotClick(groupIndex, slotIndex, username, uuid)} 
                      className={`bg-[#EDEFF7] rounded-md px-8 py-2 my-2 ${slot.uuid ===uuid?'text-[#F4976C]':''} ${slot.username === '' && slot.uuid === '' && tag !== 'creator' ?'hover:cursor-pointer':'' } ${slot.username === '' && slot.uuid === '' ? `font-bold empty-slot`:''} `}
                      >
                        {slot.username !== '' && slot.uuid !== '' ? slot.username.length > 15 ? `${slot.username.slice(0, 15)}...` : slot.username : 'Empty Slot'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          
        </div>
        
    )
}