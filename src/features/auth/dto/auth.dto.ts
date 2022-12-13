import { IsString, Matches, IsNotEmpty } from "class-validator";
import { IsEmailExist } from "../../users/users.custom.decorators";

const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export class InputModelForResendingEmail {
    @IsString()
    @Matches(pattern)
    @IsEmailExist({
        message: "Email is already exist",
    })
    email: string;
}
export class InputModelForCode {
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class CurrentUserModel {
    email: string;
    login: string;
    userId: string;
}
