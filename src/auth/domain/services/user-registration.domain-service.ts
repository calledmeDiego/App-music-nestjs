import { DomainEvent } from "src/shared/domain/events/domain-event.base";
import { authRepositoryName, type AuthRepository } from "../repository/auth.repository";
import { passwordEncrypterRepositoryName, type PasswordEncrypter } from "../repository/password-encrypter.repository";
import { Email } from "../value-objects/email.vo";
import { EmailAlreadyRegisteredException } from "../exception";
import { UserEntity } from "../entities/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import { UserRegisteredEvent } from "../events/user-registered.event";
import { EventBus } from "src/shared/domain/events/event-bus";

@Injectable()
export class UserRegistrationDomainService {
    private domainEvents: DomainEvent[] = [];

    constructor(
        @Inject(authRepositoryName) private readonly authRepository: AuthRepository,
        @Inject(passwordEncrypterRepositoryName) private readonly passwordEncrypter: PasswordEncrypter,
        private readonly eventBus: EventBus) {
    }

    async register(name: string, email: string, password: string, role: 'user' | 'admin' = 'user') {
        const emailVO = Email.create(email);
        const userExists = await this.authRepository.findByEmail(emailVO);

        if (userExists) throw new EmailAlreadyRegisteredException();

        const hashed = await this.passwordEncrypter.encrypt(password);

        const newUser = UserEntity.CreateRegisterForm({
            name,
            email: emailVO,
            password: hashed,
            role
        });

        const savedUser = await this.authRepository.register(newUser);
        await this.eventBus.publish(new UserRegisteredEvent(savedUser.id, savedUser.email.getValue()))
        
        return savedUser;
    }

    pullDomainEvents(): DomainEvent[] {
        const events = this.domainEvents;
        this.domainEvents = [];
        return events;
    }
}