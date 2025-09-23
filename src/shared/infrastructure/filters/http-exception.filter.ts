import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackLoggerService } from '../logging/slack-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  /**
   *
   */
  constructor(private readonly slackLogger: SlackLoggerService) {
  }
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message;
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    // Solo enviar a Slack si es 400 o 500
    if (Number(status) >= 400) {
      await this.slackLogger.sendMessage(`🚨 *Error en la API* 🚨
    
*Ruta:* ${request.url}
*Método:* ${request.method}
*Status:* ${status}
*Mensaje:* ${JSON.stringify(message)}`)
    }

    response.status(status).json(errorResponse);
  }
}
