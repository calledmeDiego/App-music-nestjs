import { HttpStatus } from "@nestjs/common";
import { DomainError } from "./domain-error.exception";

export class UUIDException extends DomainError {
  public httpStatus = HttpStatus.BAD_REQUEST;
  constructor() {
        super('UUID inválido');
    }
}