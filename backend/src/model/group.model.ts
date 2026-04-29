import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/db";

interface GroupAttributes {
    id: number;
    uuid: string;
    recordid: string;
    score: number;
}

type GroupCreationAttributes = Optional<GroupAttributes, 'id'>;

class Group extends Model<GroupAttributes, GroupCreationAttributes> {
    id!: number;
    uuid!: string;
    recordid!: string;
    score!: number;
}

Group.init(
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
        score:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        }

    },
    {
        sequelize,
        tableName: 'Group'
    }
)

export default Group;