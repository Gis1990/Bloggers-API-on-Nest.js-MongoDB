import { ConfigService } from "@nestjs/config";
import { HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import {
    UserAccountDBClass,
    UserAccountEmailClass,
    userDevicesDataClass,
    UserRecoveryCodeClass,
} from "../users/entities/users.entity";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
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
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class AuthService {
    constructor(
        private mailService: MailService,
        private usersService: UsersService,
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private configService: ConfigService,
    ) {}

    async createUserWithConfirmationEmail(dto: InputModelForCreatingNewUser): Promise<boolean> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailRecoveryCodeData: UserRecoveryCodeClass = new UserRecoveryCodeClass("", new Date());
        const emailConfirmation: UserAccountEmailClass = new UserAccountEmailClass(
            [],
            uuidv4(),
            add(new Date(), { hours: 1 }),
            false,
        );
        const newUser: UserAccountDBClass = new UserAccountDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.login,
            dto.email,
            passwordHash,
            new Date().toISOString(),
            emailRecoveryCodeData,
            [],
            emailConfirmation,
            [],
        );
        await this.usersService.createUserWithConfirmationEmail(newUser);
        await this.mailService.sendEmail(dto.email, newUser.emailConfirmation.confirmationCode);
        await this.usersService.addEmailLog(dto.email);
        return true;
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
            const userDevicesData: userDevicesDataClass = new userDevicesDataClass(
                ip,
                new Date(),
                Number(new Date()).toString(),
                title,
            );
            await this.usersService.addUserDevicesData(user.id, userDevicesData);
            const updatedUser = await this.usersQueryRepository.findUserById(user.id);
            updatedUser.userDevicesData = [];
            updatedUser.userDevicesData.push(userDevicesData);
            return updatedUser;
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
            const passwordRecoveryData: UserRecoveryCodeClass = new UserRecoveryCodeClass(
                uuidv4(),
                add(new Date(), { hours: 1 }),
            );
            await this.mailService.sendEmailWithPasswordRecovery(dto.email, passwordRecoveryData.recoveryCode);
            await this.usersRepository.addPasswordRecoveryCode(user.id, passwordRecoveryData);
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
        return await this.usersRepository.updatePasswordHash(user.id, passwordHash);
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
        await this.usersRepository.updateLastActiveDate(user.userDevicesData[0], newLastActiveDate);
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    userId: user.id,
                },
                {
                    secret: this.configService.get<string>("jwtAccessTokenSecret"),
                    expiresIn: "1h",
                },
            ),
            this.jwtService.signAsync(
                {
                    userId: user.id,
                    ip: user.userDevicesData[0].ip,
                    title: user.userDevicesData[0].title,
                    lastActiveDate: user.userDevicesData[0].lastActiveDate,
                    deviceId: user.userDevicesData[0].deviceId,
                },
                {
                    secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                    expiresIn: "1d",
                },
            ),
        ]);
        return [newAccessToken, newRefreshToken];
    }

    async refreshOnlyRefreshToken(user: CurrentUserWithDevicesDataModel): Promise<string> {
        return await this.jwtService.signAsync(
            {
                userId: user.id,
                ip: user.userDevicesData[0].ip,
                title: user.userDevicesData[0].title,
                lastActiveDate: user.userDevicesData[0].lastActiveDate,
                deviceId: user.userDevicesData[0].deviceId,
            },
            {
                secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                expiresIn: "1d",
            },
        );
    }
}
