import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db/db";

interface RecordAttributes {
    id: number;
    uuid: string;
    gameid: string;
    date: string;
    is_finished: boolean;
}

type RecordCreationAttributes = Optional<RecordAttributes, 'id'>;

class Record extends Model<RecordAttributes, RecordCreationAttributes> {
    id!: number;
    uuid!: string;
    gameid!: string;
    date!: string;
    is_finished!: boolean;
}

Record.init(
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
        date:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        is_finished:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false
        }

    },
    {
        sequelize,
        tableName: 'Record'
    }
)

export default Record;
export {RecordAttributes,RecordCreationAttributes}