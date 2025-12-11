import { AggregateRoot } from "src/shared/domain/events/aggregate-root";
import { Email } from "../value-objects/email.vo";
import { Role } from "../value-objects/role.vo";
import { Uuid } from "src/shared/domain/value-object/Uuid.vo";
import { UserRegisteredEvent } from "../events/user-registered.event";
import { UserLoguedEvent } from "../events/user-logued.event";

export class UserEntity extends AggregateRoot {
    private constructor(
        public readonly id: Uuid,
        public readonly email: Email,
        public readonly name: string | null,
        public readonly password: string,
        public readonly role: Role,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { super() }

    // Crea una entidad de usuario con los parametros de tipos basicos y los convierte a valores de tipo value object
    static fromPrimitives({ id, email, name, password, role, createdAt, updatedAt }: {
        id: string,
        email: string,
        name: string, password: string, role: string, createdAt: Date, updatedAt: Date
    }
    ) {
        return new this(
            Uuid.fromString(id),
            Email.fromString(email),
            name, password, Role.fromString(role),
            createdAt, updatedAt
        )
    }

    static create(data: {
        email: Email,
        name: string,
        password: string,
        role: Role,
    }) {
        const currentDate = new Date();
        const user = new this(
            Uuid.create(),
            data.email,
            data.name,
            data.password,
            data.role,
            currentDate,
            currentDate
        );

        user.record(new UserRegisteredEvent(user));
        return user;
    }

    login() {
         this.record(new UserLoguedEvent(this))
    }

    // Obtiene la data de creada de prisma y pasa a crear una entidad tipo usuaria
    static FromDbToEntityParse(data) {
        return UserEntity.fromPrimitives(data);
    }

    // Devuelve datos de tipo básicos
    toPrimitives() {
        return {
            id: this.id.value,
            name: this.name,
            email: this.email.value,
            role: this.role.value,
            createdAt: this.createdAt,
            updateAt: this.updatedAt
        }
    }
}