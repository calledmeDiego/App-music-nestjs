import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class InvalidTokenError extends DomainError {

public readonly httpStatus = HttpStatus.UNAUTHORIZED;

  constructor() {
    super(`Token inválido`);
  }
}