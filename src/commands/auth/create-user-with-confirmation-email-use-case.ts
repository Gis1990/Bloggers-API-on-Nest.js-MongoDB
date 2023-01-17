import { InputModelForCreatingNewUser } from "../../dtos/users.dto";
import { AuthService } from "../../modules/auth/auth.service";
import { SendEmailForRegistrationCommand } from "../email/send-email-for-registration-use-case";
import { UsersRepository } from "../../repositories/users.repository";
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByLoginOrEmailCommand } from "../../queries/users/get-user-by-login-or-email-query";

export class CreateUserWithConfirmationEmailCommand {
    constructor(public readonly dto: InputModelForCreatingNewUser) {}
}

@CommandHandler(CreateUserWithConfirmationEmailCommand)
export class CreateUserWithConfirmationEmailUseCase implements ICommandHandler<CreateUserWithConfirmationEmailCommand> {
    constructor(
        private queryBus: QueryBus,
        private usersRepository: UsersRepository,
        private authService: AuthService,
        private commandBus: CommandBus,
    ) {}

    async execute(command: CreateUserWithConfirmationEmailCommand): Promise<boolean> {
        await this.authService.createUser(command.dto, false);
        const user = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.login));
        const confirmationCode = user.emailConfirmation.confirmationCode;
        await this.commandBus.execute(new SendEmailForRegistrationCommand(command.dto.email, confirmationCode));
        await this.usersRepository.addEmailLog(command.dto.email);
        return true;
    }
}
