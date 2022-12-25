import { IsString } from "class-validator";
import { IsDeviceIdExist } from "../security.devices.custom.decorators";

export class deviceIdValidationModel {
    @IsString()
    @IsDeviceIdExist()
    public deviceId: string;
}
