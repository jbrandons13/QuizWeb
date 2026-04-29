import CreatorRepository from "../repository/creator.repos";
import { CreatorAttributes } from "../model/creator.model";
import { CreatorSignInPayload, CreatorSignUpPayload } from "../dto/user.dto";
import { UUIDGenerator, comparePassword, hashPassword } from "../utils/generator";


interface CreatorServiceInterface {
    signUp(attributes: CreatorSignUpPayload): Promise<CreatorAttributes|number>;
    signIn(attributes: CreatorSignInPayload): Promise<CreatorAttributes|null>;
}

class CreatorService implements CreatorServiceInterface {
    async signUp(attributes: CreatorSignUpPayload): Promise<CreatorAttributes | number> {
        const existingEmail = await CreatorRepository.findByEmail(attributes.email);
        const existingUsername = await CreatorRepository.findByUsername(attributes.username);
        if(existingEmail){
            return 1;
        }
        if(existingUsername){
            return 2;
        }
        const uuid = UUIDGenerator();
        const password = await hashPassword(attributes.password);
        const newUser = await CreatorRepository.createAccount(
            Object.assign(
                attributes,
                {uuid:uuid, password:password}
            )
        );
        return newUser;
    }

    async signIn(attributes: CreatorSignInPayload): Promise<CreatorAttributes | null> {
        const creator = await CreatorRepository.findByUsername(attributes.username);
        if(!creator){
            return null;
        }

        const flag = await comparePassword(attributes.password,creator.password);
        if(!flag){
            return null;
        }

        return creator;
    }
}

export default new CreatorService();