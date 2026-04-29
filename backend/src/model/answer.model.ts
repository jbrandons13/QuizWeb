import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/db";

interface AnswerAttributes {    
    id: number;
    uuid: string;
    playerid: string;
    questionid: string;
    choiceid: string;
    timer: number;
    score: number;
}

type AnswerCreationAttributes = Optional<AnswerAttributes, 'id'>;

class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> {
    id!: number;
    uuid!: string;
    playerid!: string;
    questionid!: string;
    choiceid!: string;
    timer!: number;
    score!: number;
}

Answer.init(
    {
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        uuid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        playerid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        questionid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        choiceid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        timer:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        score:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        }

    },
    {
        sequelize,
        tableName: 'Answer'
    }
);

export default Answer;
