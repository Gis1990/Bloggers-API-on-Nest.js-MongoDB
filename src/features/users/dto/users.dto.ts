import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsIn } from "class-validator";
import { IsEmailExist, IsLoginExist, IsUsersIdExist } from "../decorators/users.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
    LoginAttemptsClass,
    UserAccountEmailClass,
    UserDevicesDataClass,
    EmailRecoveryCodeClass,
    BanInfoClass,
} from "../users.schema";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const listOfCorrectBanStatus = ["all", "banned", "notBanned"];

export class ModelForGettingAllUsers {
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectBanStatus)
    public banStatus: string;
    @IsString()
    @IsOptional()
    public searchLoginTerm: string;
    @IsString()
    @IsOptional()
    public searchEmailTerm: string;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageSize: number;
    @IsString()
    @IsOptional()
    public sortBy: string;
    @IsString()
    @IsOptional()
    public sortDirection: string;
}

export class InputModelForCreatingNewUser {
    @IsString()
    @IsNotEmpty()
    @Length(3, 10)
    @IsLoginExist({
        message: "Login is already exist",
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public login: string;
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public password: string;
    @IsString()
    @Matches(pattern)
    @IsEmailExist({
        message: "Email is already exist",
    })
    public email: string;
}

export class InputModelForBanUnbanUser {
    @IsBoolean()
    @IsNotEmpty()
    public isBanned: boolean;
    @IsNotEmpty()
    @IsString()
    @Length(20)
    public banReason: string;
}

export class UsersIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsUsersIdExist()
    public id: string;
}

export class CreatedNewUserDto {
    public id: string;
    public login: string;
    public email: string;
    public passwordHash: string;
    public createdAt: Date;
    public emailRecoveryCode: EmailRecoveryCodeClass;
    public loginAttempts: LoginAttemptsClass[];
    public emailConfirmation: UserAccountEmailClass;
    public userDevicesData: UserDevicesDataClass[];
    public currentSession: UserDevicesDataClass;
    public banInfo: BanInfoClass;
}
