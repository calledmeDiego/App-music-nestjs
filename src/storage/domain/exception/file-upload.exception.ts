import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class UploadedFileError extends DomainError {
    public httpStatus = HttpStatus.BAD_REQUEST;

    constructor() {
        super('El acrhivo es requerido, no subío ningún archivo');
    }
}