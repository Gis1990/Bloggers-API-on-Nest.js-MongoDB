import { InputModelForResendingEmail } from "../../dtos/auth.dto";
import { SendEmailForRegistrationCommand } from "../email/send-email-for-registration-use-case";
import { UsersRepository } from "../../repositories/users.repository";
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByLoginOrEmailCommand } from "../../queries/users/get-user-by-login-or-email-query";

export class RegistrationEmailResendingCommand {
    constructor(public readonly dto: InputModelForResendingEmail) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
    constructor(private queryBus: QueryBus, private usersRepository: UsersRepository, private commandBus: CommandBus) {}

    async execute(command: RegistrationEmailResendingCommand): Promise<boolean> {
        const user = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.email));
        if (user) {
            await this.usersRepository.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        const updatedUser = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.email));
        if (updatedUser) {
            await this.commandBus.execute(
                new SendEmailForRegistrationCommand(command.dto.email, updatedUser.emailConfirmation.confirmationCode),
            );
            await this.usersRepository.addEmailLog(command.dto.email);
            return true;
        } else {
            return false;
        }
    }
}
