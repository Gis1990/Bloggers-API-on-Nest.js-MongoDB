import { IsString } from "class-validator";
import { IsDeviceIdExist } from "../decorators/security/security.devices.custom.decorators";
import { ApiProperty } from "@nestjs/swagger";

export class deviceIdValidationModel {
    @ApiProperty({ required: true, description: "Id of the device" })
    @IsString()
    @IsDeviceIdExist()
    public deviceId: string;
}
