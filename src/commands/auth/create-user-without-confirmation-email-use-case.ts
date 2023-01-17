import { InputModelForCreatingNewUser } from "../../dtos/users.dto";
import { UserViewModelClass } from "../../entities/users.entity";
import { AuthService } from "../../modules/auth/auth.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateUserWithoutConfirmationEmailCommand {
    constructor(public readonly dto: InputModelForCreatingNewUser) {}
}

@CommandHandler(CreateUserWithoutConfirmationEmailCommand)
export class CreateUserWithoutConfirmationEmailUseCase
    implements ICommandHandler<CreateUserWithoutConfirmationEmailCommand>
{
    constructor(private authService: AuthService) {}

    async execute(command: CreateUserWithoutConfirmationEmailCommand): Promise<UserViewModelClass> {
        return await this.authService.createUser(command.dto, true);
    }
}
