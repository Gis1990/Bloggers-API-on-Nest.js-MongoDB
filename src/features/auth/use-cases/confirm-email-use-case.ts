import { HttpException, Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { UsersRepository } from "../../users/users.repository";
import { ICommandHandler } from "@nestjs/cqrs";

export class ConfirmEmailCommand {
    constructor(public readonly code: string) {}
}

@Injectable()
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository, private usersRepository: UsersRepository) {}

    async execute(command: ConfirmEmailCommand): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByConfirmationCode(command.code);
        if (!user) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.isConfirmed) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.confirmationCode !== command.code) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.expirationDate < new Date()) throw new HttpException("Code is incorrect", 406);
        return await this.usersRepository.updateConfirmationCode(user.id);
    }
}
