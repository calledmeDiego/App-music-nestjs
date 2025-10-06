import { Type } from "class-transformer";
import { IsMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsString, IsUrl, Matches, ValidateNested } from "class-validator";

export class ArtistDTO {
    @IsString()
    @Matches(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/, {
        message: 'El nombre debe comenzar con mayúscula',
    })
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @IsNotEmpty()
    nationality: string;
}

export class DurationDTO {
    @IsNumber()
    @IsNotEmpty()
    start: number;

    @IsNumber()
    @IsNotEmpty()
    end: number;
}

export class CreateTrackDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    album: string;


    @IsNotEmpty()
    mediaId: string;

    @IsUrl()
    cover: string;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => ArtistDTO)
    artist: ArtistDTO

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DurationDTO)
    duration: DurationDTO
}