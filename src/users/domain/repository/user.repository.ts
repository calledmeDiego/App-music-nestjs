import { User } from "../entity/user.entity";
import { Email } from "../values-object/email.vo";

export interface UserRepository {
    register(user: User): Promise<any>;
    login(user: User): Promise<any>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
}