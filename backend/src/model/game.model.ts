import { Model, DataTypes, Optional, INTEGER } from "sequelize";
import sequelize from "../db/db";
import Question from "./question.model";
import { BlobOptions } from "buffer";

interface GameAttributes {
    id: number;
    uuid: string;
    userid: string;
    gamecode: string;
    gametitle: string;
    groupnumber: number;
    is_play : boolean;
    is_locked : boolean;
}

interface GameJoinAttributes extends GameAttributes {
    Questions: Question[];
}

type GameCreationAttributes = Optional<GameAttributes, 'id'>;

class Game extends Model<GameAttributes, GameCreationAttributes> {
    id!: number;
    uuid!: string;
    userid!: string;
    gamecode!: string;
    gametitle!: string;
    groupnumber!: number;
    is_play! : boolean;
    is_locked! : boolean;
}

Game.init(
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
        userid:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        gamecode:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        gametitle:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        groupnumber:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_play:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        is_locked:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }

    },
    {
        sequelize,
        tableName: 'Game'
    }
)

export default Game;
export {GameAttributes, GameCreationAttributes, GameJoinAttributes};