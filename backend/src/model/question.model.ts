import { Model,DataTypes, Optional } from "sequelize";
import sequelize from "../db/db";

export interface QuestionAttributes {
    id: number;
    uuid: string;
    gameid: string;
    questiontitle: string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
    answer : number;
    // mark2 : boolean;
    // mark3 : boolean;
    // mark4 : boolean;
    timer: number;
}

export type QuestionCreationAttributes = Optional<QuestionAttributes, 'id'>;

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> {
    id!: number;
    uuid!: string;
    gameid!: string;
    questiontitle!: string;
    option1! : string;
    option2! : string;
    option3! : string;
    option4! : string;
    answer! : number;
    // mark2! : boolean;
    // mark3! : boolean;
    // mark4! : boolean;
    timer!: number;
}

Question.init(
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
        gameid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        questiontitle:{
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        option1:{
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        option2:{
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        option3:{
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        option4:{
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false
        },
        answer:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // mark2:{
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        // },
        // mark3:{
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        // },
        // mark4:{
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        // },
        timer:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        }

    },
    {
        sequelize,
        tableName: 'Question'
    }
)

export default Question;
 