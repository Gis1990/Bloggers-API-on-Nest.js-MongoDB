import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsEmailExist, IsLoginExist, IsUsersIdExist } from "../users.custom.decorators";
import { Type } from "class-transformer";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class ModelForGettingAllUsers {
    @IsString()
    @IsOptional()
    searchLoginTerm: string;
    @IsString()
    @IsOptional()
    searchEmailTerm: string;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    pageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    pageSize: number;
    @IsString()
    @IsOptional()
    sortBy: string;
    @IsString()
    @IsOptional()
    sortDirection: string;
}

export class InputModelForCreatingNewUser {
    @IsString()
    @IsNotEmpty()
    @Length(3, 10)
    @IsLoginExist({
        message: "Login is already exist",
    })
    login: string;
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string;
    @IsString()
    @Matches(pattern)
    @IsEmailExist({
        message: "Email is already exist",
    })
    email: string;
}

export class UsersIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsUsersIdExist()
    id: string;
}
