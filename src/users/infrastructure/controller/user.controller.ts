import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginUserDTO } from 'src/users/application/dto/login-user.dto';
import { RegisterUserDTO } from 'src/users/application/dto/register-user.dto';
import { UserService } from 'src/users/application/use-case/user.service';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  async registerUser(@Body() body: RegisterUserDTO) {
    return this.userService.registerUser(body);
  }

  @Post('/login')
  async loginUser(@Body() body: LoginUserDTO) {
    return this.userService.loginUser(body);
  }


  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
