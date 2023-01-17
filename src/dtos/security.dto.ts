import { IsString } from "class-validator";
import { IsDeviceIdExist } from "../decorators/security/security.devices.custom.decorators";

export class deviceIdValidationModel {
    @IsString()
    @IsDeviceIdExist()
    public deviceId: string;
}
