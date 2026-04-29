export interface QuestionControllerAttributes{
    questiontitle: string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
    answer : number;
    // mark1 : boolean;
    // mark2 : boolean;
    // mark3 : boolean;
    // mark4 : boolean;
    timer: number;
}

export interface QuestionServiceAttributes{
    gameid : string;
    questiontitle: string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
    answer : number;
    // mark1 : boolean;
    // mark2 : boolean;
    // mark3 : boolean;
    // mark4 : boolean;
    timer: number;
}

export interface QuestionResultAttributes{
    uuid:string;
    questiontitle: string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
    answer : number;
    // mark1 : boolean;
    // mark2 : boolean;
    // mark3 : boolean;
    // mark4 : boolean;
    timer: number;
}