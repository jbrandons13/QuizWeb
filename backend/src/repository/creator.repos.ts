import Creator, {CreatorAttributes, CreatorCreationAttributes} from "../model/creator.model";

interface CreatorRepositoryInterface {
    createAccount(attributes:CreatorCreationAttributes) : Promise<Creator>;
    findByEmail(email:string) : Promise<Creator|null>;
    findByUsername(username:string) : Promise<Creator|null>;
}

class CreatorRepository implements CreatorRepositoryInterface {
    async createAccount(attributes: CreatorCreationAttributes): Promise<Creator> {
        return Creator.create(attributes);
    }

    async findByEmail(email: string): Promise<Creator | null> {
        return Creator.findOne({where : {email}})
    }

    async findByUsername(username: string): Promise<Creator | null> {
        return Creator.findOne({where : {username}})
    }
}

export default new CreatorRepository();