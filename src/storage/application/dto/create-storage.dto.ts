import { IsNotEmpty, IsString, IsUrl, Matches } from "class-validator";

export class CreateStorageDTO {
    @IsUrl({}, { message: 'La URL no es válida' })
    @IsNotEmpty({ message: 'La URL es obligatoria' })
    url: string;

    @IsString()
    @IsNotEmpty({message: 'El filename es obligatorio'})
    @Matches(/\.(jpg|jpeg|png|mp3|mp4|wav|mkv)$/i, {
        message:'El filename debe tener una extensión válida (.jpg, .jpeg, .png, .mp3, .mp4, .wav, .mkv)'
    })
    filename: string;
}