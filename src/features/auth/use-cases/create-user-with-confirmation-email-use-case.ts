import { InputModelForCreatingNewUser } from "../../super-admin/users/dto/users.dto";
import { AuthService } from "../auth.service";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersRepository } from "../../super-admin/users/users.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByLoginOrEmailCommand } from "../../super-admin/users/use-cases/queries/get-user-by-login-or-email-query";

export class CreateUserWithConfirmationEmailCommand {
    constructor(public readonly dto: InputModelForCreatingNewUser) {}
}

@CommandHandler(CreateUserWithConfirmationEmailCommand)
export class CreateUserWithConfirmationEmailUseCase implements ICommandHandler<CreateUserWithConfirmationEmailCommand> {
    constructor(
        private queryBus: QueryBus,
        private usersRepository: UsersRepository,
        private authService: AuthService,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(command: CreateUserWithConfirmationEmailCommand): Promise<boolean> {
        await this.authService.createUser(command.dto, false);
        const user = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.dto.login));
        const confirmationCode = user.emailConfirmation.confirmationCode;
        await this.sendEmailForRegistrationUseCase.execute(command.dto.email, confirmationCode);
        await this.usersRepository.addEmailLog(command.dto.email);
        return true;
    }
}
