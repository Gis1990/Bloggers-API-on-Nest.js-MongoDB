import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { InputModelForNewPassword } from "../dto/auth.dto";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class AcceptNewPasswordUseCase {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
    ) {}

    async execute(dto: InputModelForNewPassword): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(dto.recoveryCode);
        if (!user) return false;
        if (user.emailRecoveryCode.expirationDate < new Date()) return false;
        const passwordHash = await this.bcryptService._generateHash(dto.newPassword);
        return await this.usersRepository.updatePasswordHash(user.id, passwordHash);
    }
}
