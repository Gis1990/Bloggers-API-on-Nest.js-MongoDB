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
import { InputModelForResendingEmail } from "./dto/auth.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { add } from "date-fns";

@Injectable()
export class AuthService {
    constructor(
        protected mailService: MailService,
        protected usersService: UsersService,
        protected jwtService: JwtService,
        protected bcryptService: BcryptService,
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
    ): Promise<string | null> {
        const user = await this.usersService.findByLoginOrEmail(loginOrEmail);
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
            return user.id;
        } else {
            return null;
        }
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersService.findUserByConfirmationCode(code);
        if (!user) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.isConfirmed) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.confirmationCode !== code) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.expirationDate < new Date()) throw new HttpException("Code is incorrect", 406);
        return await this.usersService.updateConfirmation(user.id);
    }

    async registrationEmailResending(dto: InputModelForResendingEmail): Promise<boolean> {
        const user = await this.usersService.findByLoginOrEmail(dto.email);
        if (user) {
            await this.usersService.updateConfirmationCode(user.id);
        } else {
            return false;
        }
        await this.usersService.updateConfirmationCode(user.id);
        const updatedUser = await this.usersService.findByLoginOrEmail(dto.email);
        if (updatedUser) {
            await this.mailService.sendEmail(dto.email, updatedUser.emailConfirmation.confirmationCode);
            await this.usersService.addEmailLog(dto.email);
            return true;
        } else {
            return false;
        }
    }

    async refreshAllTokens(userId: string, userDevicesData: userDevicesDataClass): Promise<string[]> {
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    userId: userId,
                    ip: userDevicesData.ip,
                    title: userDevicesData.title,
                    lastActiveDate: userDevicesData.lastActiveDate,
                    deviceId: userDevicesData.deviceId,
                },
                {
                    secret: this.configService.get<string>("jwtAccessTokenSecret"),
                    expiresIn: "1h",
                },
            ),
            this.jwtService.signAsync(
                {
                    userId: userId,
                },
                {
                    secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                    expiresIn: "1d",
                },
            ),
        ]);
        return [newAccessToken, newRefreshToken];
    }

    async refreshOnlyRefreshToken(userId: string, userDevicesData: userDevicesDataClass): Promise<string> {
        return await this.jwtService.signAsync(
            {
                userId: userId,
                ip: userDevicesData.ip,
                title: userDevicesData.title,
                lastActiveDate: userDevicesData.lastActiveDate,
                deviceId: userDevicesData.deviceId,
            },
            {
                secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                expiresIn: "1d",
            },
        );
    }
}
