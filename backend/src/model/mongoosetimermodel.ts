import mongoose from "mongoose";

const TimerSchema = new mongoose.Schema({
    recordid:{
        type:String,
        required:true
    },
    timer:{
        type:Number,
        required:true
    },
});

const Timer = mongoose.model('Timer', TimerSchema);

export default Timer;
