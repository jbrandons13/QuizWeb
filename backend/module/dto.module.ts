export interface BaseResult {
    success: boolean;
    message: string;
    data?: unknown;
}

export type Token = BaseResult & {
    accessToken:string;
    expireIn:number;
}