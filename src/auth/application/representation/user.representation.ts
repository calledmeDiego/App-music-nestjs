import { UserEntity } from "src/auth/domain/entity/user.entity";
import { Email } from "src/auth/domain/values-object/email.vo";

export class UserRepresentation {
    private constructor(private readonly user: UserEntity) { }

    public static fromUser(user): UserRepresentation {
        return new this(user)
    }

    public format() {
        const user = this.user.toPrimitives()
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
        }
    }
}