import express from "express";
import { QuestionControllerAttributes } from "../dto/question.dto";
import QuestionService from "../service/question.service";
import { authenticateToken } from "../middleware/auth";
import Question from "../model/mongoosequestionmodel";

const router = express.Router();

//Store the questions to mongodb
router.post('/migrate', authenticateToken, async (req, res) => {
    try {
        const {gameid, gamecode} = req.body;
        const questionlist = await QuestionService.getQuestionByGameId(gameid);
        for(const question of questionlist){
            const newQuestion = new Question({
                flag:false,
                gameid:gameid,
                gamecode:gamecode,
                uuid: question.uuid,
                questiontitle: question.questiontitle,
                option1: question.option1,
                option2: question.option2,
                option3: question.option3,
                option4: question.option4,
                answer : question.answer,
                timer: question.timer,
            });
            await newQuestion.save();
        }

        res.status(200).json(questionlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
    
});
router.post('/:gameid', authenticateToken, async (req,res)=>{
    try {
        const payload = req.body as QuestionControllerAttributes;
        const gameid = req.params.gameid;
        const newQuestion = await QuestionService.createQuestion(Object.assign(payload,{gameid:gameid}));
        res.status(200).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

router.get('/:gameid', authenticateToken, async (req,res)=>{
    try {
        const gameid = req.params.gameid;
        const questionlist = await QuestionService.getQuestionByGameId(gameid);
        res.status(200).json(questionlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
})

router.delete('/:uuid', authenticateToken, async (req,res)=>{
    try {
        const uuid = req.params.uuid;
        const deleted = await QuestionService.deleteQuestion(uuid);
        if (deleted) {
            res.status(200).json({ message: 'Question deleted successfully' });
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;