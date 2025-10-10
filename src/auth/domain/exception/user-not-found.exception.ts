import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/shared/domain/exception/domain-error.exception";

export class UserNotFoundError extends DomainError {

public readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(email: string) {
    super(`El usuario con el email: ${email}, no fue encontrado`);
  }
}