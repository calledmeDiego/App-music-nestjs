import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Matches, ValidateNested } from "class-validator";



export class UpdateTrackDTO {

    @ApiProperty({
        description: 'Nombre de la canción',
        example: 'In bloom'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Nombre del álbum al que pertenece la canción',
        example: 'Nevermind'
    })
    @IsString()
    @IsOptional()
    album?: string;

    @ApiProperty({
        description: 'ID de la canción almacenada en Storage',
        example: 'ID',
    })
    @IsOptional()
    mediaId?: string;

    @ApiProperty({
        description: 'Enlace URL',
        example: 'http://cancion_1.com'
    })
    @IsUrl()
    @IsOptional()
    cover?: string;
}