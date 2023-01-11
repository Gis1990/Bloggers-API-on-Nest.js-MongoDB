import { UsersQueryRepository } from "../../users/users.query.repository";
import { InputModelForNewPassword } from "../dto/auth.dto";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { UsersRepository } from "../../users/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class AcceptNewPasswordCommand {
    constructor(public readonly dto: InputModelForNewPassword) {}
}

@CommandHandler(AcceptNewPasswordCommand)
export class AcceptNewPasswordUseCase implements ICommandHandler<AcceptNewPasswordCommand> {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
    ) {}

    async execute(command: AcceptNewPasswordCommand): Promise<boolean> {
        const user = await this.usersQueryRepository.getUserByRecoveryCode(command.dto.recoveryCode);
        if (!user) return false;
        if (user.emailRecoveryCode.expirationDate < new Date()) return false;
        const passwordHash = await this.bcryptService._generateHash(command.dto.newPassword);
        return await this.usersRepository.updatePasswordHash(user.id, passwordHash);
    }
}
