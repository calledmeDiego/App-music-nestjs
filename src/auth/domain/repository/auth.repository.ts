import { UserEntity } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";

export interface AuthRepository {
    register(user: UserEntity): Promise<UserEntity>;
    login(user: UserEntity);
    findById(id: string): Promise<UserEntity>;
    findByEmail(email: Email): Promise<UserEntity | null>;
}

export const authRepositoryName = 'AuthRepository';