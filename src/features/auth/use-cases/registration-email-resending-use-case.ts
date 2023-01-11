import { UsersQueryRepository } from "../../users/users.query.repository";
import { InputModelForResendingEmail } from "../dto/auth.dto";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersRepository } from "../../users/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class RegistrationEmailResendingCommand {
    constructor(public readonly dto: InputModelForResendingEmail) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(command: RegistrationEmailResendingCommand): Promise<boolean> {
        const user = await this.usersQueryRepository.getUserByLoginOrEmail(command.dto.email);
        if (user) {
            await this.usersRepository.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        const updatedUser = await this.usersQueryRepository.getUserByLoginOrEmail(command.dto.email);
        if (updatedUser) {
            await this.sendEmailForRegistrationUseCase.execute(
                command.dto.email,
                updatedUser.emailConfirmation.confirmationCode,
            );
            await this.usersRepository.addEmailLog(command.dto.email);
            return true;
        } else {
            return false;
        }
    }
}
