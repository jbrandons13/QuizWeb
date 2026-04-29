import { Model, DataTypes , Optional} from "sequelize";
import sequelize from "../db/db";

interface CreatorAttributes {
    id: number;
    uuid: string;
    email: string;
    username: string;
    password: string;
}


type CreatorCreationAttributes = Optional<CreatorAttributes, 'id'>;

class Creator extends Model<CreatorAttributes, CreatorCreationAttributes> {
    id!: number;
    uuid!: string;
    email!: string;
    username!: string;
    password!: string;
}

Creator.init(
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
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },

    },
    {
        sequelize,
        tableName: 'Creator'
    }
);
export default Creator;
export {CreatorAttributes, CreatorCreationAttributes};