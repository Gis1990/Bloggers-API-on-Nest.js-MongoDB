import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema({ versionKey: false, _id: false })
export class LoginAttemptsClass {
    @Prop({
        required: true,
    })
    attemptDate: Date;
    @Prop({
        required: true,
    })
    ip: string;
}

export const LoginAttemptsSchema = SchemaFactory.createForClass(LoginAttemptsClass);

@Schema({ versionKey: false, _id: false })
export class SentEmailsClass {
    @Prop({
        required: true,
        default: new Date().toString(),
    })
    sentDate: string;
}

export const SentEmailsSchema = SchemaFactory.createForClass(SentEmailsClass);

@Schema({ versionKey: false, _id: false })
export class EmailRecoveryCodeClass {
    @Prop({
        required: true,
        default: "No code",
    })
    recoveryCode: string;
    @Prop({
        required: true,
        default: new Date(),
    })
    expirationDate: Date;
}

export const EmailRecoveryCodeSchema = SchemaFactory.createForClass(EmailRecoveryCodeClass);

@Schema({ versionKey: false, _id: false })
export class UserAccountEmailClass {
    @Prop({
        required: true,
    })
    isConfirmed: boolean;
    @Prop({
        required: true,
    })
    confirmationCode: string;
    @Prop({
        required: true,
    })
    expirationDate: Date;
    @Prop({
        type: [SentEmailsSchema],
        required: true,
        _id: false,
    })
    sentEmails: SentEmailsClass[];
}

export const UserAccountEmailSchema = SchemaFactory.createForClass(UserAccountEmailClass);

@Schema({ versionKey: false, _id: false })
export class UserDevicesDataClass {
    @Prop({
        required: true,
    })
    ip: string;
    @Prop({
        required: true,
    })
    lastActiveDate: Date;
    @Prop({
        required: true,
    })
    deviceId: string;
    @Prop({
        required: true,
    })
    title: string;
}

export const UserDevicesDataSchema = SchemaFactory.createForClass(UserDevicesDataClass);

@Schema({ versionKey: false, _id: false })
export class BanInfoClass {
    @ApiProperty({
        type: Boolean,
        example: true,
        description: "Specifies if the user is banned or not",
    })
    @Prop({
        required: true,
    })
    isBanned: boolean;
    @ApiProperty({ type: Date, required: false, description: "nullable: true" })
    @Prop()
    banDate: Date;
    @Prop()
    @ApiProperty({ type: String, required: false, description: "nullable: true" })
    banReason: string;
}

export const BanInfoSchema = SchemaFactory.createForClass(BanInfoClass);

@Schema({ versionKey: false, _id: false })
export class ExtendedBanInfoClass extends BanInfoClass {
    @Prop({
        required: true,
    })
    blogId: string;
}

export const ExtendedBanInfoSchema = SchemaFactory.createForClass(ExtendedBanInfoClass);

@Schema({ versionKey: false })
export class UserAccountClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    login: string;
    @Prop({
        required: true,
    })
    email: string;
    @Prop({
        required: true,
    })
    passwordHash: string;
    @Prop({
        required: true,
    })
    createdAt: Date;
    @Prop({
        type: EmailRecoveryCodeSchema,
        required: true,
        _id: false,
    })
    emailRecoveryCode: EmailRecoveryCodeClass;
    @Prop({
        required: true,
        _id: false,
        default: [],
    })
    loginAttempts: LoginAttemptsClass[];
    @Prop({
        type: UserAccountEmailSchema,
        required: true,
        _id: false,
    })
    emailConfirmation: UserAccountEmailClass;
    @Prop({
        type: [UserDevicesDataSchema],
        required: true,
        _id: false,
    })
    userDevicesData: UserDevicesDataClass[];
    @Prop({
        type: UserDevicesDataSchema,
        required: true,
    })
    currentSession: UserDevicesDataClass;
    @Prop({
        type: BanInfoSchema,
        required: true,
    })
    // if banned by sa
    banInfo: BanInfoClass;
    @Prop({
        type: [ExtendedBanInfoSchema],
        required: true,
        _id: false,
    })
    // if banned by bloggers
    banInfoForBlogs: ExtendedBanInfoClass;
}

export const UsersAccountSchema = SchemaFactory.createForClass(UserAccountClass);
