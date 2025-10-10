import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class DurationNullException extends DomainError {
    public readonly httpStatus = HttpStatus.NOT_ACCEPTABLE;
   
    constructor() {
        super('No hay duración');        
    }
}