export interface GameCreationServiceAttributes{
    userid: string;
}
export interface GameUpdateAttributes{
    gameid: string;
    gametitle: string;
    groupnumber: number;
}

export interface GameUpdateControllerAttributes{
    gametitle: string;
    groupnumber: number;
}


export interface GameResult {
    uuid: string;
    // userid: string;
    gamecode: string;
    gametitle: string;
    groupnumber: number;
    is_play: boolean;
    is_locked: boolean;
}