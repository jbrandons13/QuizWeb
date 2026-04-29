export type RecordAttributes = {
    uuid:string,
    gameid:string,
    date:string,
    is_finished:boolean
}

export type RecordData = {
    playerid:string,
    username:string,
    score:number, 
    ranking:number,
    questionAndAnswers: QuestionAndAnswers[];
}

export type GroupData = {
    groupid:string,
    groupnumber:number,
    players:[{
        playerid:string,
        username:string,
        score:number
    }],
    groupscore:number,
    ranking:number
}

export type QuestionAndAnswers = {
    questiontitle: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
    playeranswer: number;
};

export type HardestQuestion = {
    uuid:string;
    questiontitle: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
    correctanswer:number;
}

export type QuestionsDetails = {
    question:{
        uuid:string,
        questiontitle:string,
        option1 : string,
        option2 : string,
        option3 : string,
        option4 : string,
        answer : number
    }
    correctPlayers:[{
        playerid:string,
        username:string,
        playeranswer:number
    }]
    incorrectPlayers:[{
        playerid:string,
        username:string,
        playeranswer:number
    }]
    noanswerPlayers:[{
        playerid:string,
        username:string,
        playeranswer:number
    }]
}