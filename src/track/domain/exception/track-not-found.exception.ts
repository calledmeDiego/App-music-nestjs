import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class TrackNotFoundException extends DomainError {
    public readonly httpStatus = HttpStatus.NOT_FOUND;
   
    constructor() {
        super('Track no fue encontrado');        
    }
}