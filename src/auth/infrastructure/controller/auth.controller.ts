import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginUserDTO } from 'src/auth/application/dto/login-user.dto';
import { RegisterUserDTO } from 'src/auth/application/dto/register-user.dto';
import { AuthService } from 'src/auth/application/use-case/auth.service';

@ApiTags('Auth - Endpoints de autenticación')
@Controller('')
export class AuthController {
  constructor(private readonly userService: AuthService) { }

  @Post('/register')
  @ApiOperation({ summary: 'Registra un nuevo usuario en el sistema' })
  @ApiBody({
    type: RegisterUserDTO,
    description: 'Estructura del JSON para el registro'
  })
  // 2. Describe la respuesta de éxito (201 CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente.',
    schema: {
      example: {
        id: 'id',
        email: 'juanperez@example.com',
        name: 'Juan Perez',
        createdAt: 'Fecha de creación'
      }
    }
  })
  async registerUser(@Body() body: RegisterUserDTO, @Res() response: Response) {
    const registeredUser = await this.userService.registerUser(body);
    return response.status(HttpStatus.CREATED).json(registeredUser);
  }

  @ApiOperation({ summary: 'Autentica un usuario en el sistema' })
  @ApiBody({
    type: LoginUserDTO,
    description: 'Estructura del JSON para la autenticación'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario autenticado exitosamente.',
    schema: {
      example: {
        token: 'jsonwebtoken',
        user: {
          id: 'id',
          email: 'juanperez@example.com',
          name: 'Juan Perez',
          createdAt: 'Fecha de creación'
        }
      }
    }
  })
  @Post('/login')
  async loginUser(@Body() body: LoginUserDTO, @Res() response: Response) {
    const userLogued = await this.userService.loginUser(body);
    return response.status(HttpStatus.OK).json(userLogued);
  }
}
