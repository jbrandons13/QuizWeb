import { RecordCreationServiceAttributes, RecordResult, RecordUUIDAttributes } from "../dto/record.dto";
import { RecordAttributes } from "../model/record.model";
import recordRepository from "../repository/record.repos";
import { UUIDGenerator } from "../utils/generator";

interface RecordServiceInterface {
    createRecord(attributes:RecordCreationServiceAttributes):Promise<RecordAttributes>;
    getRecordUUID(gameid:string):Promise<RecordUUIDAttributes|null>;
    getAllRecord(gameid:string):Promise<RecordResult[]>;
    deleteRecord(recordid:string):Promise<Boolean>;
    recordFinish(recordid:string):Promise<Boolean>;
}

function getFormattedDate() {
    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // const date = currentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    const date = currentDate.toISOString().slice(0, 10);
    return `${date} ${time}`;
  }

class RecordService implements RecordServiceInterface {
    async createRecord(attributes: RecordCreationServiceAttributes): Promise<RecordAttributes> {
        const uuid = UUIDGenerator();
        const date = getFormattedDate();
        const is_finished = false;
        const newRecord = await recordRepository.createRecord(
            Object.assign(
                attributes,
                {uuid:uuid,date:date,is_finished:is_finished}
            )
        );
        return newRecord;

    }
    async getRecordUUID(gameid: string): Promise<RecordUUIDAttributes | null> {
        return await recordRepository.getRecordUUID(gameid);
    }
    async getAllRecord(gameid: string): Promise<RecordResult[]> {
        return recordRepository.getAllRecord(gameid)
    }
    async deleteRecord(recordid: string): Promise<Boolean> {
        return await recordRepository.deleteRecord(recordid);
    }
    async  recordFinish(recordid:string): Promise<Boolean> {
        return await recordRepository.recordFinish(recordid);
    }
}

export default new RecordService();