export interface RecordCreationServiceAttributes{
    gameid: string;
}

export interface RecordUUIDAttributes{
    uuid:string;
}

export interface RecordResult {
    uuid:string,
    gameid:string,
    date:string,
    is_finished:boolean
}