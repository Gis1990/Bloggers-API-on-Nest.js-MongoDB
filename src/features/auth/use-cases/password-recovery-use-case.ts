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
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class PasswordRecoveryCommand {
    constructor(public readonly dto: InputModelForPasswordRecovery) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private bcryptService: BcryptService,
        private sendEmailForPasswordRecoveryUseCase: SendEmailForPasswordRecoveryUseCase,
        @InjectModel(EmailRecoveryCodeClass.name) private userRecoveryCodeModelClass: Model<EmailRecoveryCodeClass>,
    ) {}

    async execute(command: PasswordRecoveryCommand): Promise<true> {
        const user = await this.usersQueryRepository.getUserByLoginOrEmail(command.dto.email);
        if (user) {
            const createUserRecoveryCodeDto = {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), { hours: 1 }),
            };
            const passwordRecoveryData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass(
                createUserRecoveryCodeDto,
            );
            await this.sendEmailForPasswordRecoveryUseCase.execute(
                command.dto.email,
                passwordRecoveryData.recoveryCode,
            );
            await this.usersRepository.addPasswordRecoveryCode(user.id, passwordRecoveryData);
            return true;
        } else {
            return true;
        }
    }
}
