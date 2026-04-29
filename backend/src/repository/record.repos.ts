import { RecordResult, RecordUUIDAttributes } from "../dto/record.dto";
import Group from "../model/mongoosegroupmodel";
import Player from "../model/mongooseplayermodel";
import Record, { RecordCreationAttributes } from "../model/record.model";

interface RecordRepositoryInterface {
    createRecord(attributes:RecordCreationAttributes):Promise<Record>;
    getRecordUUID(gameid:string):Promise<RecordUUIDAttributes|null>;
    getAllRecord(gameid:string):Promise<RecordResult[]>;
    deleteRecord(recordid:string):Promise<Boolean>;
    deleteRecordbyGameid(gameid:string):Promise<Boolean>;
    recordFinish(recordid:string):Promise<Boolean>;
}


class RecordRepository implements RecordRepositoryInterface {
    async createRecord(attributes: RecordCreationAttributes): Promise<Record> {
        await Record.destroy({where:{gameid:attributes.gameid, is_finished:false}});
        return await Record.create(attributes);
    }

    async getRecordUUID(gameid: string): Promise<RecordUUIDAttributes|null> {
        const record = await Record.findOne({where:{gameid:gameid, is_finished:false}, attributes:['uuid']});
        return record;
    }
    async getAllRecord(gameid: string): Promise<RecordResult[]> {
        const records = await Record.findAll({where:{gameid:gameid, is_finished:true}, order:[['date','DESC']]});
        return records;
    }
    async deleteRecord(recordid: string): Promise<Boolean> {
        const deletedRowCount = await Record.destroy({where:{uuid:recordid}});
        await Player.deleteMany({recordid:recordid});
        await Group.deleteMany({recordid:recordid});
        return deletedRowCount > 0;
    }
    async deleteRecordbyGameid(gameid: string): Promise<Boolean> {
        const deletedRowCount = await Record.destroy({where:{gameid:gameid}});
        await Player.deleteMany({gameid:gameid});
        await Group.deleteMany({gameid:gameid});
        return deletedRowCount > 0;
    }
    async recordFinish(recordid: string): Promise<Boolean> {
        const [rowsUpdated, [updatedRecord]] = await Record.update(
            { is_finished: true },
            {
              where: { uuid: recordid },
              returning: true, // This option will return the updated record
            }
          );
        if (rowsUpdated > 0) {
            return true;
        } else {
            return false;
        }
    }
}

export default new RecordRepository();