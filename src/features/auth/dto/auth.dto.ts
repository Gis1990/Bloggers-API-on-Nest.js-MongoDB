import { IsString, Matches, IsNotEmpty, Length } from "class-validator";
import { IsEmailExist } from "../../users/users.custom.decorators";
import { userDevicesDataClass } from "../../users/entities/users.entity";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class InputModelForResendingEmail {
    @IsString()
    @Matches(pattern)
    @IsEmailExist({
        message: "Email is already exist",
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
    public code: string;
}

export class InputModelForNewPassword {
    @IsString()
    @Length(6, 20)
    public newPassword: string;
    @IsString()
    @IsNotEmpty()
    public recoveryCode: string;
}

export class CurrentUserModel {
    public email: string;
    public login: string;
    public userId: string;
}

export class CurrentUserWithDevicesDataModel {
    public email: string;
    public login: string;
    public userId: string;
    public userDevicesData: userDevicesDataClass[];
}
