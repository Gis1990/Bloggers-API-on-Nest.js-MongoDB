import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { InputModelForCreatingNewUser } from "../users/dto/users.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { add } from "date-fns";
import { BanInfoClass, EmailRecoveryCodeClass, UserAccountEmailClass } from "../users/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserViewModelClass } from "../users/entities/users.entity";
import { CreateUserCommand } from "../users/use-cases/create-user-use-case";
import { CommandBus } from "@nestjs/cqrs";

@Injectable()
export class AuthService {
    constructor(
        private commandBus: CommandBus,
        private bcryptService: BcryptService,
        @InjectModel(UserAccountEmailClass.name) private userAccountEmailModelClass: Model<UserAccountEmailClass>,
        @InjectModel(EmailRecoveryCodeClass.name) private userRecoveryCodeModelClass: Model<EmailRecoveryCodeClass>,
        @InjectModel(BanInfoClass.name) private banInfoClass: Model<BanInfoClass>,
    ) {}

    async createUser(
        dto: InputModelForCreatingNewUser,
        isConfirmed: boolean,
        isBanned: boolean,
    ): Promise<UserViewModelClass> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailRecoveryCodeData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass();
        const createdEmailConfirmationDto = {
            isConfirmed: isConfirmed,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), { hours: 1 }),
            sentEmails: [],
        };
        const createdBanInfoDto = {
            isBanned: isBanned,
            banDate: new Date(),
            banReason: "None",
        };
        const banInfo: BanInfoClass = new this.banInfoClass(createdBanInfoDto);
        const emailConfirmation: UserAccountEmailClass = new this.userAccountEmailModelClass(
            createdEmailConfirmationDto,
        );
        return await this.commandBus.execute(
            new CreateUserCommand(dto, passwordHash, emailConfirmation, emailRecoveryCodeData, banInfo),
        );
    }
}
