import { HttpException } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByConfirmationCodeCommand } from "../../queries/users/get-user-by-confirmation-code-query";

export class ConfirmEmailCommand {
    constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand> {
    constructor(private queryBus: QueryBus, private usersRepository: UsersRepository) {}

    async execute(command: ConfirmEmailCommand): Promise<boolean> {
        const user = await this.queryBus.execute(new GetUserByConfirmationCodeCommand(command.code));
        if (!user) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.isConfirmed) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.confirmationCode !== command.code) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.expirationDate < new Date()) throw new HttpException("Code is incorrect", 406);
        return await this.usersRepository.userConfirmedEmail(user.id);
    }
}
