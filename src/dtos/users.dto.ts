import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsIn } from "class-validator";
import { IsEmailExist, IsLoginExist, IsUsersIdExist } from "../decorators/users/users.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
    LoginAttemptsClass,
    UserAccountEmailClass,
    UserDevicesDataClass,
    EmailRecoveryCodeClass,
    BanInfoClass,
    UserAccountClass,
} from "../schemas/users.schema";
import { IsBlogsIdExistInTheRequestBody } from "../decorators/blogs/blogs.custom.decorators";
import { ApiProperty } from "@nestjs/swagger";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const listOfCorrectBanStatus = ["all", "banned", "notBanned"];

export class ModelForGettingAllUsers {
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectBanStatus)
    @IsOptional()
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
    @ApiProperty({
        type: Boolean,
        example: true,
        description: "Specifies if the user is banned or not",
    })
    @IsBoolean()
    @IsNotEmpty()
    public isBanned: boolean;
    @ApiProperty({
        type: String,
        description: "The reason why the user was banned",
        maxLength: 20,
    })
    @IsNotEmpty()
    @IsString()
    @Length(20)
    public banReason: string;
}

export class InputModelForBanUnbanUserByBloggerForBlog extends InputModelForBanUnbanUser {
    @ApiProperty({ required: true, description: "BlogId Id that should be banned" })
    @IsNotEmpty()
    @IsString()
    @IsBlogsIdExistInTheRequestBody({
        message: "BlogsId is not exist",
    })
    public blogId: string;
}

export class UsersIdValidationModel {
    @ApiProperty({ required: true, description: "User Id that should be banned" })
    @IsString()
    @IsNotEmpty()
    @IsUsersIdExist()
    public id: string;
}

export class ModelForGettingAllBannedUsersForBlog {
    @ApiProperty({ type: String, description: "The search term for a login", default: null, required: false })
    @IsString()
    @IsOptional()
    public searchLoginTerm: string;
    @ApiProperty({ default: 1, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @ApiProperty({ default: 10, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageSize: number;
    @ApiProperty({ default: "createdAt", required: false })
    @IsString()
    @IsOptional()
    public sortBy: string;
    @ApiProperty({ default: "desc", required: false, enum: ["asc", "desc"] })
    @IsString()
    @IsOptional()
    public sortDirection: string;
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

export class BanDataForUserDto {
    public isBanned: boolean;
    public banDate: Date;
    public banReason: string;
}

export class UsersPaginationDto {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: UserAccountClass[];
}
