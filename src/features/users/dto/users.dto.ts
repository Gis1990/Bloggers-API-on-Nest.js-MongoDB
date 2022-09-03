import { IsString, Length, Matches, IsNotEmpty } from "class-validator";
import { IsEmailExist, IsLoginExist, IsUsersIdExist } from "../users.custom.decorators";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class ModelForGettingAllUsers {
    PageNumber: number;
    PageSize: number;
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
