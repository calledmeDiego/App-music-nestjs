import { UserEntity } from "../entity/user.entity";
import { Email } from "../values-object/email.vo";

export interface AuthRepository {
    register(user: UserEntity): Promise<UserEntity>;
    login(user: UserEntity);
    findById(id: string): Promise<UserEntity>;
    findByEmail(email: Email): Promise<UserEntity | null>;
}