import { GameResult, GameUpdateAttributes } from "../dto/game.dto";
import Game, { GameCreationAttributes } from "../model/game.model"
import Question from "../model/question.model";

interface GameRepositoryInterface {
    createGame(attributes:GameCreationAttributes):Promise<Game>;
    getGameById(uuid:string):Promise<GameResult|null>;
    getGameByUserId(userid:string):Promise<GameResult[]>;
    getGameIdByGameCode(gamecode:string):Promise<GameResult|null>;
    updateGame(attributes:GameUpdateAttributes):Promise<Game|null>;
    deleteGameById(uuid:string):Promise<Boolean>;
    setIsPlay(gameid:string,flag:boolean):Promise<Boolean>;
    setIsLocked(gameid:string,flag:boolean):Promise<Boolean>;
}

class GameRepository implements GameRepositoryInterface {
    async createGame(attributes: GameCreationAttributes): Promise<Game> {
        return Game.create(attributes);
    }
    async getGameById(uuid:string):Promise<GameResult|null> {
        return await Game.findOne({where:{uuid}, attributes:{exclude:['id','userid']}});
        // return await Game.findOne({where:{uuid}, attributes:{exclude:['id','userid']}, include : 
        //     [{model: Question, 
        //         as:'Questions', 
        //         attributes:['questiontitle', 'option1', 'option2', 'option3', 'option4', 'answer', 'timer']}]});
    }
    async getGameByUserId(userid: string): Promise<GameResult[]> {
        return await Game.findAll({where:{userid}})
    }
    async getGameIdByGameCode(gamecode: string): Promise<GameResult | null> {
        const game = await Game.findOne({where:{gamecode}, attributes:['uuid','gamecode','gametitle','groupnumber','is_play','is_locked']});
        if (game) {
            return game;
        } else {
            return null;
        }
    }
    async updateGame(attributes:GameUpdateAttributes): Promise<Game | null> {
        const game = await Game.findOne({where:{uuid:attributes.gameid}});
        if(!game){
            return null;
        }
        await game.update({gametitle:attributes.gametitle,groupnumber:attributes.groupnumber});
        return game;
    }
    async deleteGameById(uuid: string): Promise<Boolean> {
        const deletedRowCount = await Game.destroy({where:{uuid}});
        return deletedRowCount > 0;
    }
    async setIsPlay(gameid: string,flag: boolean): Promise<Boolean> {
        const [rowsUpdated, [updatedGame]] = await Game.update(
            { is_play: flag },
            {
              where: { uuid: gameid },
              returning: true, // This option will return the updated record
            }
          );
        if (rowsUpdated > 0) {
            return true;
        } else {
            return false;
        }
    }

    async setIsLocked(gameid: string,flag: boolean): Promise<Boolean> {
        const [rowsUpdated, [updatedGame]] = await Game.update(
            { is_locked: flag },
            {
              where: { uuid: gameid },
              returning: true, // This option will return the updated record
            }
          );
        if (rowsUpdated > 0) {
            return true;
        } else {
            return false;
        }
    }
}

export default new GameRepository();