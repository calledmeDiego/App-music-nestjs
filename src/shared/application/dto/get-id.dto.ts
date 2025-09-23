import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetIdDTO {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}