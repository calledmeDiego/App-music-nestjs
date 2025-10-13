import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsString, IsUrl, Matches, ValidateNested } from "class-validator";

export class ArtistDTO {
    @ApiProperty({
        description: 'Nombre del artista',
        example: 'Nirvana'
    })
    @IsString()
    @Matches(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/, {
        message: 'El nombre debe comenzar con mayúscula',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Apodo o nombre artístico',
        example: 'Nirvana'
    })
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({
        description: 'Nacionalidad del artista',
        example: 'Estadounidense'
    })
    @IsString()
    @IsNotEmpty()
    nationality: string;
}

export class DurationDTO {
    @ApiProperty({
        description: 'Tiempo de inicio en segundos',
        example: 0,
        minimum: 0
    })
    @IsNumber()
    @IsNotEmpty()
    start: number;

    @ApiProperty({
        description: 'Tiempo de fin en segundos',
        example: 180,
        minimum: 0
    })
    @IsNumber()
    @IsNotEmpty()
    end: number;
}

export class CreateTrackDTO {

    @ApiProperty({
        description: 'Nombre de la canción',
        example: 'In bloom'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Nombre del álbum al que pertenece la canción',
        example: 'Nevermind'
    })
    @IsString()
    @IsNotEmpty()
    album: string;

    @ApiProperty({
        description: 'ID de la canción alamacenada en Storage',
        example: 'ID',
    })
    @IsNotEmpty()
    mediaId: string;

    @ApiProperty({
        description: 'Enlace URL',
        example: 'http://cancion_1.com'
    })
    @IsUrl()
    cover: string;

    @ApiProperty({
        description: 'Información del artista',
        type: ()=> ArtistDTO
    })
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => ArtistDTO)
    artist: ArtistDTO

    @ApiProperty({
        description: 'Duración de la canción',
        type: ()=> DurationDTO
    })
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DurationDTO)
    duration: DurationDTO
}