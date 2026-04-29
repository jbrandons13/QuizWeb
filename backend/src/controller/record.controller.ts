import express from 'express';
import { authenticateToken } from '../middleware/auth';
import recordService from '../service/record.service';
import gameRepository from '../repository/game.repos';
import Question from '../model/mongoosequestionmodel';
import Player from '../model/mongooseplayermodel';
import Group from '../model/mongoosegroupmodel';
import questionRepository from '../repository/question.repos';
import { PlayerAttribute } from '../dto/player.dto';
import recordRepos from '../repository/record.repos';

import Excel from 'exceljs';
import path from 'path';
import questionService from '../service/question.service';
import waitingRoomSocket from '../socket/waitingroom.socket';
const router = express.Router();

router.get('/create/:gameid', authenticateToken, async (req,res)=>{
    try {
        const gameid = req.params.gameid;
        const newRecord = await recordService.createRecord({gameid:gameid});
        const setgameflag = await gameRepository.setIsPlay(gameid,true);
        if(!setgameflag){
            res.status(404).json(null);
        }
        res.status(200).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

router.get('/allrecord/:gameid', authenticateToken, async (req,res)=>{
    const gameid = req.params.gameid;
    try {
        const records = await recordService.getAllRecord(gameid);
        const game = await gameRepository.getGameById(gameid);
        const questions = await questionRepository.getQuestionByGameId(gameid);
        const totalquestions = questions.length;
        if (records !== null) {
            res.status(200).json({game, records, totalquestions});
            } else {
            res.status(404).json({ error: "No records found for this game." });
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/data/:recordid', authenticateToken, async (req,res)=>{
    const recordid = req.params.recordid;
    try {
        const response = await Player.find({recordid:recordid}).sort({score:-1}).exec();
          const result = response.map((player, index) => ({
            playerid: player.uuid,
            username: player.username,
            score: player.score,
            ranking: index + 1, // Add 1 to start ranking from 1
            questionAndAnswers: player.questionsAndAnswers
        }));
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/group/:recordid', authenticateToken, async (req,res)=>{
    const recordid = req.params.recordid;
    try {
        const response = await Group.find({recordid:recordid}).sort({groupScore:-1}).exec();
        
        const result = response.map((group, index) => ({
            groupid:group.groupid,
            groupnumber:group.groupnumber,
            players:group.players,
            groupscore:group.groupScore,
            ranking:index+1
        }));
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get('/questions/:gameid/:recordid', authenticateToken, async (req,res)=>{
    const gameid = req.params.gameid;
    const recordid = req.params.recordid;
    try {
        const response = await questionRepository.getQuestionByGameId(gameid);
        let result = [];
        for( const question of response){
            const questionid = question.uuid;
            const questionanswer = question.answer;
            const players = await Player.find({recordid:recordid},{uuid:1, username:1, questionsAndAnswers:1}).sort({username:1});
            let correct = [];
            let incorrect = [];
            let noanswer = [];
            for (const player of players) {
                const foundQuestion = player.questionsAndAnswers.find(
                    (q) => q.uuid === questionid
                );
            
                if (foundQuestion) {
                    const playerAnswer = foundQuestion.playeranswer; // Replace 'playerAnswer' with your actual field
                    
                    if (playerAnswer === questionanswer) {
                        console.log("correct==================");
                        const playeratt = {
                            playerid:player.uuid,
                            username:player.username,
                            playeranswer:playerAnswer
                        }
                        correct.push(playeratt);
                    } else if (playerAnswer !== 0) {
                        console.log("incorrect==================");
                        const playeratt = {
                            playerid:player.uuid,
                            username:player.username,
                            playeranswer:playerAnswer
                        }
                        incorrect.push(playeratt);
                    } else {
                        console.log("noanswer==================");
                        const playeratt = {
                            playerid:player.uuid,
                            username:player.username,
                            playeranswer:0
                        }
                        noanswer.push(playeratt);
                    }
                } else {
                    console.log("disconnect==================");
                    const playeratt = {
                        playerid:player.uuid,
                        username:player.username,
                        playeranswer:0
                    }
                    noanswer.push(playeratt);
                }
            }


            const questionandplayer ={
                question:{
                    uuid:question.uuid,
                    questiontitle:question.questiontitle,
                    option1 : question.option1,
                    option2 : question.option2,
                    option3 : question.option3,
                    option4 : question.option4,
                    answer : question.answer
                },
                correctPlayers:correct,
                incorrectPlayers:incorrect,
                noanswerPlayers:noanswer
            }

            result.push(questionandplayer);
        }
        console.log('the response', result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/check/:gameid', async (req, res) =>{
    const gameid = req.params.gameid;
    try {
        const recordid = await recordService.getRecordUUID(gameid);
        if (!recordid) {
            return res.status(200).json({text:'error'});
        }
        return res.status(200).json({text:'success'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/excel/:gameid/:recordid', authenticateToken, async (req, res) => {
    const recordid = req.params.recordid;
    const gameid = req.params.gameid;
    const questions = await questionService.getQuestionByGameId(gameid);
    const questionTitles = questions.map(question => question.questiontitle);
    try {
        const response = await Player.find({ recordid }).sort({ score: -1 }).exec();
        const result = response.map((player, index) => {
            const answers = [];
            let playerIndex = 0;
            for(let Qindex = 0; Qindex < questionTitles.length; Qindex++){
                if(player.questionsAndAnswers.length > playerIndex){
                    let qa = player.questionsAndAnswers[playerIndex];
                    console.log("THE PLAYERINDEX", playerIndex);
                    console.log("THE QA", qa);
                    
                        if(qa.questiontitle === questionTitles[Qindex]){
                            answers.push(
                                qa.playeranswer === 1 ? qa.option1 :
                                qa.playeranswer === 2 ? qa.option2 :
                                qa.playeranswer === 3 ? qa.option3 :
                                qa.playeranswer === 4 ? qa.option4 : 'No Answer'
                            )
                            playerIndex++;
                        }
                        else{
                            answers.push("Skipped");
                        }
                }
                else{
                    answers.push("Skipped");
                }

            }
            return {
                ranking: index + 1,
                playerid: player.uuid,
                username: player.username,
                score: player.score,
                answers: answers
            };
            // const playerResult = {
            //     ranking: index + 1,
            //     playerid: player.uuid,
            //     username: player.username,
            //     score: player.score,
            //     answers: player.questionsAndAnswers.map((qa, Qnumber) => {
            //         if(qa.questiontitle === questionTitles[Qnumber]){
            //             return qa.playeranswer === 1 ? qa.option1 :
            //                 qa.playeranswer === 2 ? qa.option2 :
            //                     qa.playeranswer === 3 ? qa.option3 :
            //                         qa.playeranswer === 4 ? qa.option4 : 'No Answer';
            //         }
            //         else{
            //             return 'No Answer';
            //         }
            //     })
            // };
            // return playerResult;
        });

       

        res.status(200).json({ data: result, questions: questionTitles }); // Return player data and questions to frontend
    } catch (error) {
        console.error('Error generating Excel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/join', async (req, res) => {
    try {
        const { gamecode } = req.body;
        const game = await gameRepository.getGameIdByGameCode(gamecode);

        if (game == null) {
            return res.status(200).json({value:{}, text:'Game not found'});
            // return res.status(404).json({ error: "Game not found" });
        }

        if (game.is_play == true) {
            if(game.is_locked == false){
                const recordid = await recordService.getRecordUUID(game.uuid);

                if (!recordid) {
                    return res.status(200).json({value:{}, text:'Error'});
                    // return res.status(401).json({error: "Game is not open"});
                }
                console.log("success returning recordid");
                return res.status(200).json({value:Object.assign(recordid,{gameid:game.uuid}), text:'Success'});
            }
            else if(game.is_locked == true){
                return res.status(200).json({value:{}, text:'Game is still running'});
                // return res.status(401).json({ error: "Game is still running" });
            }
        }
        else{
            return res.status(200).json({value:{}, text:'Game is not open'});
        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/group', authenticateToken, async (req,res)=>{
    try {
        const { gameid } = req.body;
        const setgameflag = await gameRepository.setIsLocked(gameid,true);
        if(setgameflag){
            res.status(200).json(setgameflag);
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
})
router.post('/play', authenticateToken, async (req,res)=>{
    try {
        console.log("-----------PLAY----------");
        const { gameid } = req.body;
        const setgameflag = await gameRepository.setIsLocked(gameid,true);
        if(setgameflag){
            res.status(200).json(setgameflag);
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
        
})
router.post('/finish',authenticateToken, async (req,res)=>{
    try {
        console.log("-----------FINISH----------");
        const { recordid,gameid, gamecode } = req.body;
        const response = await recordService.recordFinish(recordid);
        await Question.deleteMany({gamecode:gamecode});
        await gameRepository.setIsPlay(gameid,false);
        await gameRepository.setIsLocked(gameid,false);
        if(response){
            res.status(200).json("Record has been succesfully finished");
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
    
})
router.delete('/force/:gameid', authenticateToken, async (req,res)=>{
    try {
        const gameid = req.params.gameid;
        const recordid = await recordRepos.getRecordUUID(gameid);
        if(recordid){
            await Question.deleteMany({gameid:gameid});
            const deletedboolean = await recordService.deleteRecord(recordid.uuid);
            await gameRepository.setIsPlay(gameid,false);
            await gameRepository.setIsLocked(gameid,false);
            if(deletedboolean){
                res.status(200).json({message:"Record has been succesfully deleted",recordid:recordid});
            }
        }
    } catch (error) {
        
    }
})
router.delete('/:recordid/:gameid', authenticateToken, async (req,res)=>{
    try {
        const recordid = req.params.recordid;
        const gameid = req.params.gameid;
        const deletedboolean = await recordService.deleteRecord(recordid);
        await gameRepository.setIsPlay(gameid,false);
        await gameRepository.setIsLocked(gameid,false);
        if(deletedboolean){
            res.status(200).json("Record has been succesfully deleted");
        }
        
    } catch (error) {
        
    }
})


export default router;