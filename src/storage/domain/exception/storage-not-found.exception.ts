import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class StorageNotFoundException extends DomainError {
    public httpStatus = HttpStatus.NOT_FOUND;

    constructor() {
        super('Storage no encontrado');
    }
}