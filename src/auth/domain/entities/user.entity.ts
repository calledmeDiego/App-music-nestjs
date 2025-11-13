import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { Email } from "../value-objects/email.vo";
import { UserRegisteredEvent } from "../events/user-registered.event";
import { AggregateRoot } from "src/shared/domain/events/aggregate-root";

export class UserEntity extends AggregateRoot {
    private constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly name: string | null,
        public readonly password: string,
        public readonly role: 'user' | 'admin',
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { super() }

    static CreateRegisterForm(data: {
        email: Email,
        name: string,
        password: string,
        role: 'user' | 'admin',
    }) {
        const user = new UserEntity(
            '',
            data.email,
            data.name,
            data.password,
            data.role,
            new Date(),
            new Date()
        );
        return user;
    }

    public static CreateLoginForm(data: {
        email: Email,
        password: string,
        role: 'user' | 'admin',
    }) {
        return new UserEntity(
            '',
            data.email,
            '',
            data.password,
            data.role,
            new Date(),
            new Date()
        );
    }

    static toParse(data) {
        return new UserEntity(
            data.id,
            data.email,
            data.name,
            data.password,
            data.role,
            data.createdAt,
            data.updatedAt
        );
    }

    toPrimitives() {
        const { password, ...publicData } = this;
        return publicData;
    }
}