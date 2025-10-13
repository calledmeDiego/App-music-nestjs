import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({
        description: 'Correo electrónico único del usuario',
        example:'usuario@ejemplo.com',
        required: true
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña registrada del usuario',
        example:'password123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}