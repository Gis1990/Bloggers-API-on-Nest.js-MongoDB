import { IsString } from "class-validator";

export class deviceIdValidationModel {
    @IsString()
    public deviceId: string;
}
