import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    flag:{
        type:Boolean,
        required:true
    },
    gameid:{
        type:String,
        required:true
    },
    gamecode:{
        type:String,
        required:true
    },
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
    timer:{
        type:Number,
        required:true
    },
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question;
