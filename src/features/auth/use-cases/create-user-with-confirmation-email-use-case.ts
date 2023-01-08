import { InputModelForCreatingNewUser } from "../../users/dto/users.dto";
import { AuthService } from "../auth.service";
import { SendEmailForRegistrationUseCase } from "../../../utils/email/use-cases/send-email-for-registration-use-case";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { UsersRepository } from "../../users/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateUserWithConfirmationEmailCommand {
    constructor(public readonly dto: InputModelForCreatingNewUser) {}
}

@CommandHandler(CreateUserWithConfirmationEmailCommand)
export class CreateUserWithConfirmationEmailUseCase implements ICommandHandler<CreateUserWithConfirmationEmailCommand> {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private authService: AuthService,
        private sendEmailForRegistrationUseCase: SendEmailForRegistrationUseCase,
    ) {}

    async execute(command: CreateUserWithConfirmationEmailCommand): Promise<boolean> {
        await this.authService.createUser(command.dto, false);
        const user = await this.usersQueryRepository.findByLoginOrEmail(command.dto.login);
        const confirmationCode = user.emailConfirmation.confirmationCode;
        await this.sendEmailForRegistrationUseCase.execute(command.dto.email, confirmationCode);
        await this.usersRepository.addEmailLog(command.dto.email);
        return true;
    }
}
