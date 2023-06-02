import { IsString, Matches, IsNotEmpty, Length } from "class-validator";
import { IsEmailExistOrConfirmed } from "../decorators/users/users.custom.decorators";
import { Transform, TransformFnParams } from "class-transformer";
import { UserDevicesDataClass } from "../schemas/users.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class InputModelForResendingEmail {
    @ApiProperty({
        example: "myemail@gmail.com",
        pattern: "/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/",
        required: true,
    })
    @IsString()
    @Matches(pattern)
    @IsEmailExistOrConfirmed({
        message: `Email doesn't exist or confirmed`,
    })
    public email: string;
}

export class InputModelForPasswordRecovery {
    @ApiProperty({
        example: "myemail@gmail.com",
        pattern: "/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/",
        required: true,
    })
    @IsString()
    @Matches(pattern)
    public email: string;
}

export class InputModelForCode {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public code: string;
}

export class InputModelForNewPassword {
    @ApiProperty({ type: String, minLength: 1, maxLength: 20, required: true })
    @IsString()
    @Length(6, 20)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public newPassword: string;
    @ApiProperty({ example: uuidv4(), required: true })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public recoveryCode: string;
}

export class CurrentUserModel {
    public email: string;
    public login: string;
    public id: string;
}

export class CurrentUserModelForMeEndpoint {
    @ApiProperty({ type: String })
    public email: string;
    @ApiProperty({ type: String })
    public login: string;
    @ApiProperty({ type: String })
    public userId: string;
}

export class CurrentUserWithDevicesDataModel extends CurrentUserModel {
    public userDevicesData: UserDevicesDataClass[];
    public currentSession: UserDevicesDataClass;
}

export class LoginDto {
    @ApiProperty({ type: String, required: true })
    public loginOrEmail: string;
    @ApiProperty({ type: String, required: true })
    public password: string;
}
