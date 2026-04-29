import redis from "../db/redis";
import { QuestionResultAttributes, QuestionServiceAttributes } from "../dto/question.dto";
import { QuestionAttributes } from "../model/question.model";
import QuestionRepository from "../repository/question.repos";
import { UUIDGenerator } from "../utils/generator";

interface QuestionServiceInterface {
    createQuestion(attributes:QuestionServiceAttributes):Promise<QuestionAttributes>;
    deleteQuestion(uuid:string):Promise<Boolean>;
    getQuestionByGameId(uuid:string):Promise<QuestionResultAttributes[]>;
    // getQuestionByGameIdRedis(uuid:string):Promise<QuestionResultAttributes[]>;
}

class QuestionService implements QuestionServiceInterface {
    async createQuestion(attributes: QuestionServiceAttributes): Promise<QuestionAttributes> {
        const uuid = UUIDGenerator();
        const newQuestion = await QuestionRepository.createQuestion(
            Object.assign(
                attributes,
                {uuid:uuid}
            )
        );
        return newQuestion;
    }

    async deleteQuestion(uuid: string): Promise<Boolean> {
        const deleted = await QuestionRepository.deleteQuestion(uuid);
        return deleted;
    }

    async getQuestionByGameId(uuid: string): Promise<QuestionResultAttributes[]> {
        return QuestionRepository.getQuestionByGameId(uuid);
    }

    // async getQuestionByGameIdRedis(uuid: string): Promise<QuestionResultAttributes[]> {
    //     const cacheKey = `questions:${uuid}`;
    //     const cachedQuestions = await redis.get(cacheKey);

    //     if(cachedQuestions){
    //         return JSON.parse(cachedQuestions);
    //     }

    //     const questions = await QuestionRepository.getQuestionByGameId(uuid);
    //     await redis.set(cacheKey, JSON.stringify(questions));

    //     return questions;
    // }
}

export default new QuestionService();