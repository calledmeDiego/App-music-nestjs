import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserLoguedEvent } from "src/auth/domain/events/user-logued.event";
import { UserRegisteredEvent } from "src/auth/domain/events/user-registered.event";

@Injectable()
export class UserEventHandler {
    @OnEvent('user.registered', {async: true})
    handleUserRegistered(event: UserRegisteredEvent) {
        console.log('Handler registro de usuarios ejecutado: ', event.ocurredOn)
    }
    @OnEvent('user.logued', {async: true})
    handleUserLogued(event: UserLoguedEvent) {
        console.log('Handler login ejecutado: ', event.ocurredOn)
    }
}