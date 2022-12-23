import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsEmailExist, IsLoginExist, IsUsersIdExist } from "../users.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class ModelForGettingAllUsers {
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

export class UsersIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsUsersIdExist()
    public id: string;
}
