import { InputModelForResendingEmail } from "../dto/auth.dto";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersRepository } from "../../super-admin/users/users.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByLoginOrEmailCommand } from "../../super-admin/users/use-cases/queries/get-user-by-login-or-email-query";

export class RegistrationEmailResendingCommand {
    constructor(public readonly dto: InputModelForResendingEmail) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
    constructor(
        private queryBus: QueryBus,
        private usersRepository: UsersRepository,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(command: RegistrationEmailResendingCommand): Promise<boolean> {
        const user = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.email));
        if (user) {
            await this.usersRepository.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        const updatedUser = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.email));
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
