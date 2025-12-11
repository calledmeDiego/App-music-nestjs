import { HttpStatus } from '@nestjs/common';

/**
 * Clase base para todos los errores de Dominio, que lleva información
 */
export abstract class DomainError extends Error {
  // el código de estado HTTP.
  public abstract readonly httpStatus: HttpStatus; 
  
  constructor(message: string) {
    super(message);
   // Nombre de la clase hija
  }
}