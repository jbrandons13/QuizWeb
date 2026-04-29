import express from 'express';
import GameService from '../service/game.service';
import { GameUpdateControllerAttributes } from '../dto/game.dto';
import { authenticateToken } from '../middleware/auth';
import { log } from 'console';
import recordRepository from '../repository/record.repos';
import Question from '../model/mongoosequestionmodel';

const router = express.Router();

//creategame
router.post('/', authenticateToken, async (req,res) => {

        try {
            const userid = req.app.locals.userid.userid;
            const newGame = await GameService.createGame({userid:userid});
            res.status(200).json(newGame);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    
    
    return {status: true}
});

//updategame
router.put('/:gameid', authenticateToken, async (req,res) => {
    
    try {
        const payload = req.body as GameUpdateControllerAttributes;
        const gameid = req.params.gameid;
        const updateGame = await GameService.updateGame(Object.assign(payload,{gameid:gameid}));
        res.status(200).json('Game is successfully updated' );
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
    
    return {status: true}
});

//get all games list by userid

router.get("/", authenticateToken, async (req, res) => {
    try {
        const userid = req.app.locals.userid.userid;
        const gamelist = await GameService.getGameByUserId(userid);
        if (gamelist !== null) {
            res.status(200).json(gamelist);
            } else {
            res.status(404).json({ error: "No games found for the user." });
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get 1 game details
router.get("/:uuid", authenticateToken, async (req, res) => {
    try {
        const uuid = req.params.uuid;
    
        const Game = await GameService.getGameById(uuid);
        res.status(200).json(Game);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//delete game by id
router.delete('/:uuid', authenticateToken, async (req,res)=>{
    try {
        const uuid = req.params.uuid;
        const deleted = await GameService.deleteGameById(uuid);
        const deletedrecord = await recordRepository.deleteRecordbyGameid(uuid);
        await Question.deleteMany({gameid:uuid});
        if (deleted) {
            res.status(200).json({ message: 'Game deleted successfully' });
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
export default router;