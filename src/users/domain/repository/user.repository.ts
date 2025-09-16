import { User } from "../entity/user.entity";
import { Email } from "../values-object/email.vo";

export interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
}