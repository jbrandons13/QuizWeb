import { GameCreationServiceAttributes, GameResult, GameUpdateAttributes } from "../dto/game.dto";
import { GameAttributes } from "../model/game.model";
import gameRepository from "../repository/game.repos";
import questionRepository from "../repository/question.repos";
import recordRepository from "../repository/record.repos";
import { UUIDGenerator } from "../utils/generator";

interface GameServiceInterface {
    createGame(attributes:GameCreationServiceAttributes):Promise<GameAttributes>;
    getGameById(uuid:string):Promise<GameResult|null>;
    getGameByUserId(userid:string):Promise<GameResult[]>;
    getGameIdByGameCode(gamecode:string):Promise<GameResult|null>;
    updateGame(attributes:GameUpdateAttributes):Promise<GameAttributes|null>;
    deleteGameById(uuid:string):Promise<Boolean>;
}

class GameService implements GameServiceInterface {
    async createGame(attributes: GameCreationServiceAttributes): Promise<GameAttributes> {
        const uuid = UUIDGenerator();
        const gamecode = UUIDGenerator(3);
        const gametitle = "Please input the game title";
        const groupnumber = 1;
        const is_play = false;
        const is_locked = false;
        const newGame = await gameRepository.createGame(
            Object.assign(
                attributes,
                {uuid:uuid,gamecode:gamecode,gametitle:gametitle, groupnumber:groupnumber,is_play:is_play,is_locked:is_locked}
            )
        )

        // Bikin Record
        // newRecord = recordRepo.createRecord(newGame.uuid)
        return newGame;
    }

    async updateGame(attributes: GameUpdateAttributes): Promise<GameAttributes | null> {
        const existingGame = await gameRepository.getGameById(attributes.gameid);
        if(!existingGame){
            return null;
        }
        
        const updatedgame = await gameRepository.updateGame(attributes);

        return updatedgame;
    }

    async getGameById(uuid: string): Promise<GameResult | null> {
        return await gameRepository.getGameById(uuid);
    }
    async getGameByUserId(userid: string): Promise<GameResult[]> {
        return await gameRepository.getGameByUserId(userid);
    }
    async getGameIdByGameCode(gamecode: string): Promise<GameResult | null> {
        return await gameRepository.getGameIdByGameCode(gamecode);
    }
    
    async deleteGameById(uuid: string): Promise<Boolean> {
        const deleted = await gameRepository.deleteGameById(uuid);
        const deletedQuestion = await questionRepository.deleteQuestionByGameId(uuid);
        const deletedRecord = await recordRepository.deleteRecord(uuid);
        return deleted;
    }
    
}

export default new GameService();