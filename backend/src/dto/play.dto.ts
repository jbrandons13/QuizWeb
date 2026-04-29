export interface AnswerPayload{
    gametype:string,
    question:{
        uuid:string,
        questiontitle:string,
        option1:string,
        option2:string,
        option3:string,
        option4:string,
        answer:number,
        timer:number
      },
      player:{
        recordid:string, 
        gameid:string,
        gamecode:string, 
        playerid:string,
        username:string,
        playeranswer:number,
        duration:number,
      } 
    
}