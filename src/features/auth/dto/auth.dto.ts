import { IsString, Matches, IsNotEmpty, Length } from "class-validator";
import { IsEmailExistOrConfirmed } from "../../users/decorators/users.custom.decorators";
import { Transform, TransformFnParams } from "class-transformer";
import { UserDevicesDataClass } from "../../users/users.schema";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class InputModelForResendingEmail {
    @IsString()
    @Matches(pattern)
    @IsEmailExistOrConfirmed({
        message: `Email doesn't exist or confirmed`,
    })
    public email: string;
}

export class InputModelForPasswordRecovery {
    @IsString()
    @Matches(pattern)
    public email: string;
}

export class InputModelForCode {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public code: string;
}

export class InputModelForNewPassword {
    @IsString()
    @Length(6, 20)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public newPassword: string;
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
    public email: string;
    public login: string;
    public userId: string;
}

export class CurrentUserWithDevicesDataModel extends CurrentUserModel {
    public userDevicesData: UserDevicesDataClass[];
    public currentSession: UserDevicesDataClass;
}
