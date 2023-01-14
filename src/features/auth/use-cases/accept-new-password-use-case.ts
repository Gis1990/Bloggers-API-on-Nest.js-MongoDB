import { InputModelForNewPassword } from "../dto/auth.dto";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { UsersRepository } from "../../super-admin/users/users.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByRecoveryCodeCommand } from "../../super-admin/users/use-cases/queries/get-user-by-recovery-code-query";

export class AcceptNewPasswordCommand {
    constructor(public readonly dto: InputModelForNewPassword) {}
}

@CommandHandler(AcceptNewPasswordCommand)
export class AcceptNewPasswordUseCase implements ICommandHandler<AcceptNewPasswordCommand> {
    constructor(
        private queryBus: QueryBus,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
    ) {}

    async execute(command: AcceptNewPasswordCommand): Promise<boolean> {
        const user = await this.queryBus.execute(new GetUserByRecoveryCodeCommand(command.dto.recoveryCode));
        if (!user) return false;
        if (user.emailRecoveryCode.expirationDate < new Date()) return false;
        const passwordHash = await this.bcryptService._generateHash(command.dto.newPassword);
        return await this.usersRepository.updatePasswordHash(user.id, passwordHash);
    }
}
