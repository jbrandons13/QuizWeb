import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    recordid:{
        type:String,
        required:true
    },
    gameid:{
        type:String,
        required:true
    },
    groupid:{
        type:String,
        required:true
    },
    groupnumber:{
        type:Number,
        required:true
    },
    players:[{
        playerid:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        score:{
            type:Number,
            required:true
        }
    }],
    groupScore:{
        type:Number,
        required:true
    }

});

const Group = mongoose.model('Group', GroupSchema);

export default Group;