import { Type } from "class-transformer";
import { IsMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested } from "class-validator";

export class ArtistDTO {
    @IsString()
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

    @IsMongoId()
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