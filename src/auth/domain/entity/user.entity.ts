import { Email } from "../values-object/email.vo";

export class UserEntity {

    constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly name: string | null,
        public readonly password: string,
        public readonly role: 'user' | 'admin',
        public readonly createdAt: Date,
        public readonly updatedAt: Date,

    ) {

    }

    static CreateForm(data: {
        email: Email,
        name: string,
        password: string,
        role: 'user' | 'admin',
    }) {
        return new UserEntity(
            '',
            data.email,
            data.name,
            data.password,
            data.role,
            new Date(),
            new Date()
        )
    }

    static CreateFormLogin(data: {
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
        )
    }

    static ShowJSON(data) {
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
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            // 🚫 password no se devuelve
        };
    }
}