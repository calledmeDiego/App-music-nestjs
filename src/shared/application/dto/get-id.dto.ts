import { IsMongoId, IsNotEmpty, IsUUID } from "class-validator";

export class GetIdDTO {
    
    @IsNotEmpty()
    @IsUUID()
    id: string;
}