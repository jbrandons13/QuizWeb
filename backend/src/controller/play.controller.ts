// import express from 'express';
// import QuestionService from "../service/question.service";
// import { authenticateToken } from '../middleware/auth';
// import Question from '../model/mongoosequestionmodel';
// const router = express.Router();

// //Store the questions to mongodb
// router.post('/', authenticateToken, async (req, res) => {
//     try {
//         const {gameid, gamecode} = req.body;
//         const questionlist = await QuestionService.getQuestionByGameId(gameid);
//         for(const question of questionlist){
//             const newQuestion = new Question({
//                 flag:false,
//                 gameid:gameid,
//                 gamecode:gamecode,
//                 uuid: question.uuid,
//                 questiontitle: question.questiontitle,
//                 option1: question.option1,
//                 option2: question.option2,
//                 option3: question.option3,
//                 option4: question.option4,
//                 answer : question.answer,
//                 timer: question.timer,
//             });
//             await newQuestion.save();
//         }

//         res.status(200).json(questionlist);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: "Internal server error"});
//     }
    
// });

// export default router;
