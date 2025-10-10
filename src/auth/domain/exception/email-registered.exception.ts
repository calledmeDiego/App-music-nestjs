
import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class EmailAlreadyRegisteredException extends DomainError {
    public readonly httpStatus = HttpStatus.CONFLICT;

    constructor() {
        super(`El email ya está registrado.`);
    }

}