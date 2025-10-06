import { UserEntity } from "../entity/user.entity";
import { Email } from "../values-object/email.vo";

export interface AuthRepository {
    register(user: UserEntity): Promise<any>;
    login(user: UserEntity): Promise<any>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: Email): Promise<UserEntity | null>;
}