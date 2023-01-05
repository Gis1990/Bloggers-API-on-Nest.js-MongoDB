import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { InputModelForResendingEmail } from "../dto/auth.dto";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class RegistrationEmailResendingUseCase {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(dto: InputModelForResendingEmail): Promise<boolean> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (user) {
            await this.usersRepository.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        const updatedUser = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (updatedUser) {
            await this.sendEmailForRegistrationUseCase.execute(
                dto.email,
                updatedUser.emailConfirmation.confirmationCode,
            );
            await this.usersRepository.addEmailLog(dto.email);
            return true;
        } else {
            return false;
        }
    }
}
