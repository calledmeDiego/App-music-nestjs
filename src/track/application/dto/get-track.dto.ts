import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetTrackDTO {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}