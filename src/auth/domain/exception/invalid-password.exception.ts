import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class InvalidPasswordError extends DomainError {

public readonly httpStatus = HttpStatus.UNAUTHORIZED;

  constructor() {
    super(`Contraseña incorrecta.`);
  }
}