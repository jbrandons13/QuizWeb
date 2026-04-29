import express from "express";
import { authenticateToken } from "../middleware/auth";
import Timer from "../model/mongoosetimermodel";

const activeIntervals:any = {}; // Object to store active intervals by recordid

const updateTimerPerSecond = async (recordid:string) => {
  try {
    if (activeIntervals[recordid]) {
      clearInterval(activeIntervals[recordid]); // Clear existing interval for this recordid
    }

    activeIntervals[recordid] = setInterval(async () => {
      const existingTimer = await Timer.findOne({ recordid });

      if (existingTimer) {
        existingTimer.timer -= 1;

        if (existingTimer.timer < 0) {
          clearInterval(activeIntervals[recordid]);
          delete activeIntervals[recordid]; 
          console.log('Timer telah mencapai 0');
        } else {
          await existingTimer.save();
          console.log(`Timer ${recordid}: ${existingTimer.timer} seconds remaining`);
        }
      } else {
        clearInterval(activeIntervals[recordid]);
        console.log('Timer tidak ditemukan');
      }
    }, 1000);
  } catch (error) {
    console.error('Error updating timer:', error);
  }
};

const router = express.Router();

router.post('/set', authenticateToken, async (req, res) => {
  const { recordid, timer } = req.body;
  console.log("THETIMER", timer);

  try {
    const existingTimer = await Timer.findOne({ recordid });

    if (existingTimer) {
      existingTimer.timer = timer;
      await existingTimer.save();
    } else {
      const newTimer = new Timer({ recordid, timer });
      await newTimer.save();
    }

    updateTimerPerSecond(recordid);
    res.status(200).json({ message: 'Timer set' });
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});


router.get('/take/:recordid', async(req,res)=>{
    const recordid =  req.params.recordid; 
    try {
        const existingTimer = await Timer.findOne({ recordid });
            if (existingTimer) {
                const timer = existingTimer.timer; 
                res.status(200).json(timer);
            }
    } catch (error) {
        
    }
})
export default router;