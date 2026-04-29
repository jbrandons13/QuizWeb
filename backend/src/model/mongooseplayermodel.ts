import mongoose from "mongoose";

const PlayerSchema =new mongoose.Schema({
    recordid:{
        type:String,
        required:true
    },
    gameid:{
        type:String,
        required:true
    },
    gamecode:{
        type:String,
        required:true,
    },
    uuid:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true
    },
    is_ready:{
        type:Boolean,
        required:true
    },
    is_ready_init:{
        type:Boolean,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    questionsAndAnswers: [{
        uuid:{
            type:String,
            required:true
        },
        questiontitle:{
            type:String,
            required:true
        },
        option1:{
            type:String,
            required:true
        },
        option2:{
            type:String,
            required:true
        },
        option3:{
            type:String,
            required:true
        },
        option4:{
            type:String,
            required:true
        },
        answer:{
            type:Number,
            required:true
        },
        playeranswer:{
            type:Number,
            required: true
        }
    }]
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;