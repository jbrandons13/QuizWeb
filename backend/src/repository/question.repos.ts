import { QuestionResultAttributes } from "../dto/question.dto";
import Question, { QuestionCreationAttributes } from "../model/question.model";

interface QuestionRepositoryInterface {
    createQuestion(attributes:QuestionCreationAttributes):Promise<Question>;
    deleteQuestion(uuid:string):Promise<Boolean>;
    deleteQuestionByGameId(uuid:string):Promise<Boolean>;
    getQuestionByGameId(uuid:string):Promise<QuestionResultAttributes[]>;
}

class QuestionRepository implements QuestionRepositoryInterface {
    async createQuestion(attributes: QuestionCreationAttributes): Promise<Question> {
        return Question.create(attributes);
    }

    async deleteQuestion(uuid: string): Promise<Boolean> {
        const deletedCount = await Question.destroy({where:{uuid}});
        return deletedCount > 0;
    }

    async deleteQuestionByGameId(uuid: string): Promise<Boolean> {
        const deletedCount = await Question.destroy({where:{gameid:uuid}});
        return deletedCount > 0;
    }
    async getQuestionByGameId(uuid: string): Promise<QuestionResultAttributes[]> {
        return await Question.findAll({where:{gameid:uuid}, attributes:{exclude:['id','gameid']}})
    }
}

export default new QuestionRepository();
