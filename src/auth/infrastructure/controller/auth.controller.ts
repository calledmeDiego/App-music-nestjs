import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { LoginUserDTO } from 'src/auth/application/dto/login-user.dto';
import { RegisterUserDTO } from 'src/auth/application/dto/register-user.dto';
import { AuthService } from 'src/auth/application/use-case/auth.service';


@Controller('')
export class AuthController {
  constructor(private readonly userService: AuthService) { }

  @Post('/register')
  async registerUser(@Body() body: RegisterUserDTO, @Res() response: Response) {
    const registeredUser = await this.userService.registerUser(body);
    return response.status(HttpStatus.CREATED).json(registeredUser);
  }

  @Post('/login')
  async loginUser(@Body() body: LoginUserDTO, @Res() response: Response) {
    const userLogued = await this.userService.loginUser(body);
    return response.status(HttpStatus.OK).json(userLogued);
  }

  // @Get(':id')
  // getUserById(@Param('id') id: string) {
  //   return this.userService.findById(id);
  // }
}
