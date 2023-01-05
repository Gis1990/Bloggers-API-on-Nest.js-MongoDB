import { InputModelForCreatingNewUser } from "../../users/dto/users.dto";
import { NewUserClassResponseModel } from "../../users/entities/users.entity";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class CreateUserWithoutConfirmationEmailUseCase {
    constructor(private authService: AuthService) {}

    async execute(dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        return await this.authService.createUser(dto, true);
    }
}
