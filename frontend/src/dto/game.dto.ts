export type GameAttributes = {
    uuid: string;
    gamecode: string;
    gametitle: string;
    groupnumber: number;
    is_play: boolean;
    is_locked: boolean;
}

export type SingleResult = {
    playerid:string,
    username:string,
    score:number,
    ranking:number
}

export type GroupResult = {
    groupid:string,
    groupnumber:number,
    players:{playerid:string,username:string,score:number}[],
    groupscore:number,
    ranking:number,
}

