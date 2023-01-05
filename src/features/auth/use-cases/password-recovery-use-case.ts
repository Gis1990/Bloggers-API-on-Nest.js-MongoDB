import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { InputModelForPasswordRecovery } from "../dto/auth.dto";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { EmailRecoveryCodeClass } from "../../users/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SendEmailForPasswordRecoveryUseCase } from "../../../utils/email/use-cases/send-email-for-password-recovery-use-case";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class PasswordRecoveryUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private bcryptService: BcryptService,
        private sendEmailForPasswordRecoveryUseCase: SendEmailForPasswordRecoveryUseCase,
        @InjectModel(EmailRecoveryCodeClass.name) private userRecoveryCodeModelClass: Model<EmailRecoveryCodeClass>,
    ) {}

    async execute(dto: InputModelForPasswordRecovery): Promise<true> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (user) {
            const createUserRecoveryCodeDto = {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), { hours: 1 }),
            };
            const passwordRecoveryData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass(
                createUserRecoveryCodeDto,
            );
            await this.sendEmailForPasswordRecoveryUseCase.execute(dto.email, passwordRecoveryData.recoveryCode);
            await this.usersRepository.addPasswordRecoveryCode(user.id, passwordRecoveryData);
            return true;
        } else {
            return true;
        }
    }
}
