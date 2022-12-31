import { ConfigService } from "@nestjs/config";
import { HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "../../utils/email/mail.service";
import { InputModelForCreatingNewUser } from "../users/dto/users.dto";
import {
    CurrentUserWithDevicesDataModel,
    InputModelForNewPassword,
    InputModelForPasswordRecovery,
    InputModelForResendingEmail,
} from "./dto/auth.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { add } from "date-fns";
import { UsersQueryRepository } from "../users/users.query.repository";
import {
    EmailRecoveryCodeClass,
    UserAccountDBClass,
    UserAccountEmailClass,
    UserDevicesDataClass,
} from "../users/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NewUserClassResponseModel } from "../users/entities/users.entity";

@Injectable()
export class AuthService {
    constructor(
        private mailService: MailService,
        private usersService: UsersService,
        private usersQueryRepository: UsersQueryRepository,
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private configService: ConfigService,
        @InjectModel(UserAccountEmailClass.name) private userAccountEmailModelClass: Model<UserAccountEmailClass>,
        @InjectModel(UserDevicesDataClass.name) private userDevicesDataModelClass: Model<UserDevicesDataClass>,
        @InjectModel(EmailRecoveryCodeClass.name) private userRecoveryCodeModelClass: Model<EmailRecoveryCodeClass>,
    ) {}

    async createUserWithConfirmationEmail(dto: InputModelForCreatingNewUser): Promise<boolean> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailRecoveryCodeData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass();
        const createdEmailConfirmationDto = {
            isConfirmed: false,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), { hours: 1 }),
            sentEmails: [],
        };
        const emailConfirmation: UserAccountEmailClass = new this.userAccountEmailModelClass(
            createdEmailConfirmationDto,
        );
        await this.usersService.createUser(dto, passwordHash, emailConfirmation, emailRecoveryCodeData);
        await this.mailService.sendEmail(dto.email, createdEmailConfirmationDto.confirmationCode);
        await this.usersService.addEmailLog(dto.email);
        return true;
    }

    async createUserWithoutConfirmationEmail(dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailRecoveryCodeData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass();
        const createdEmailConfirmationDto = {
            isConfirmed: true,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), { hours: 1 }),
            sentEmails: [],
        };
        const emailConfirmation: UserAccountEmailClass = new this.userAccountEmailModelClass(
            createdEmailConfirmationDto,
        );
        return await this.usersService.createUser(dto, passwordHash, emailConfirmation, emailRecoveryCodeData);
    }

    async checkCredentials(
        loginOrEmail: string,
        password: string,
        ip: string,
        title: string | undefined,
    ): Promise<UserAccountDBClass | null> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        await this.usersService.addLoginAttempt(user.id, ip);
        const isHashesEqual = await this.bcryptService._isHashesEquals(password, user.passwordHash);
        if (isHashesEqual && user.emailConfirmation.isConfirmed) {
            const createdUserDevicesData = {
                ip: ip,
                lastActiveDate: new Date(),
                title: title,
                deviceId: Number(new Date()).toString(),
            };
            const userDevicesData: UserDevicesDataClass = new this.userDevicesDataModelClass(createdUserDevicesData);
            await this.usersService.addUserDevicesData(user.id, userDevicesData);
            await this.usersService.addCurrentSession(user.id, userDevicesData);
            return await this.usersQueryRepository.findUserById(user.id);
        } else {
            return null;
        }
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByConfirmationCode(code);
        if (!user) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.isConfirmed) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.confirmationCode !== code) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.expirationDate < new Date()) throw new HttpException("Code is incorrect", 406);
        return await this.usersService.updateConfirmation(user.id);
    }

    async passwordRecovery(dto: InputModelForPasswordRecovery): Promise<true> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (user) {
            const createUserRecoveryCodeDto = {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), { hours: 1 }),
            };
            const passwordRecoveryData: EmailRecoveryCodeClass = new this.userRecoveryCodeModelClass(
                createUserRecoveryCodeDto,
            );
            await this.mailService.sendEmailWithPasswordRecovery(dto.email, passwordRecoveryData.recoveryCode);
            await this.usersService.addPasswordRecoveryCode(user.id, passwordRecoveryData);
            return true;
        } else {
            return true;
        }
    }

    async acceptNewPassword(dto: InputModelForNewPassword): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(dto.recoveryCode);
        if (!user) return false;
        if (user.emailRecoveryCode.expirationDate < new Date()) return false;
        const passwordHash = await this.bcryptService._generateHash(dto.newPassword);
        return await this.usersService.updatePasswordHash(user.id, passwordHash);
    }

    async registrationEmailResending(dto: InputModelForResendingEmail): Promise<boolean> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (user) {
            await this.usersService.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        await this.usersService.updateConfirmationCode(user.id);
        const updatedUser = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
        if (updatedUser) {
            await this.mailService.sendEmail(dto.email, updatedUser.emailConfirmation.confirmationCode);
            await this.usersService.addEmailLog(dto.email);
            return true;
        } else {
            return false;
        }
    }

    async refreshAllTokens(user: CurrentUserWithDevicesDataModel): Promise<string[]> {
        const newLastActiveDate = new Date();
        await this.usersService.updateLastActiveDate(user.currentSession.deviceId, newLastActiveDate);
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: user.id,
                },
                {
                    secret: this.configService.get<string>("jwtAccessTokenSecret"),
                    expiresIn: "5 minutes",
                },
            ),
            this.jwtService.signAsync(
                {
                    id: user.id,
                    ip: user.currentSession.ip,
                    title: user.currentSession.title,
                    lastActiveDate: newLastActiveDate,
                    deviceId: user.currentSession.deviceId,
                },
                {
                    secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                    expiresIn: "10 minutes",
                },
            ),
        ]);
        return [newAccessToken, newRefreshToken];
    }

    async refreshOnlyRefreshToken(user: CurrentUserWithDevicesDataModel): Promise<string> {
        const newLastActiveDate = new Date();
        await this.usersService.updateLastActiveDate(user.currentSession.deviceId, newLastActiveDate);
        await this.usersService.terminateSpecificDevice(user.id, user.currentSession.deviceId);
        return await this.jwtService.signAsync(
            {
                id: user.id,
                ip: user.currentSession.ip,
                title: user.currentSession.title,
                lastActiveDate: newLastActiveDate,
                deviceId: user.currentSession.deviceId,
            },
            {
                secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                expiresIn: "10 minutes",
            },
        );
    }
}
