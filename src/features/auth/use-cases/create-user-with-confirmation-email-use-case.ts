import { InputModelForCreatingNewUser } from "../../users/dto/users.dto";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class CreateUserWithConfirmationEmailUseCase {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private authService: AuthService,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(dto: InputModelForCreatingNewUser): Promise<boolean> {
        await this.authService.createUser(dto, false);
        const user = await this.usersQueryRepository.findByLoginOrEmail(dto.login);
        const confirmationCode = user.emailConfirmation.confirmationCode;
        await this.sendEmailForRegistrationUseCase.execute(dto.email, confirmationCode);
        await this.usersRepository.addEmailLog(dto.email);
        return true;
    }
}
