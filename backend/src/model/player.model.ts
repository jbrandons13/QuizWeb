import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/db";

interface PlayerAttributes {
    id: number;
    uuid: string;
    recordid: string;
    playername: string;
    groupid: string;
}

type PlayerCreationAttributes = Optional<PlayerAttributes, 'id'>;

class Player extends Model<PlayerAttributes, PlayerCreationAttributes> {
    id!: number;
    uuid!: string;
    recordid!: string;
    playername!: string;
    groupid!: string;
}

Player.init(
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
        recordid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        playername:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        groupid:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }


    },
    {
        sequelize,
        tableName: 'Player'
    }
)

export default Player;
export {PlayerAttributes, PlayerCreationAttributes};