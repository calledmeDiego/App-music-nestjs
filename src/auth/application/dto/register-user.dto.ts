import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDTO {

    @ApiProperty({
        description: 'Correo electrónico único del usuario',
        example: 'juan.perez@dominio.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Nombre real del usuario',
        example: 'Juan Perez',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Contraseña con al menos 6 caracteres',
        example: 'password123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 carácteres' })
    @MaxLength(15, { message: 'La contraseña no debe tener más de 15 carácteres' })
    password: string;


}