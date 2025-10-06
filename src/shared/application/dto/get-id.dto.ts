import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetIdDTO {
    
    @IsNotEmpty()
    id: string;
}