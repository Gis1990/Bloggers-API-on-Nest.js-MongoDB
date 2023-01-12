import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostClass, PostsSchema } from "../posts/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { SuperAdminController } from "./super.admin.controller";
import { BindUserWithBlogUseCase } from "./users/use-cases/bind-user-with-blog-use-case";
import {
    IsEmailExistConstraint,
    IsLoginExistConstraint,
    IsUsersIdExistConstraint,
} from "./users/decorators/users.custom.decorators";
import { BlogsRepository } from "../blogs/blogs.repository";
import { BlogClass, BlogsSchema } from "../blogs/blogs.schema";
import { IsBlogsIdExistConstraint } from "../blogs/decorators/blogs.custom.decorators";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { UsersQueryRepository } from "./users/users.query.repository";
import {
    BanInfoClass,
    BanInfoSchema,
    BannedUsersClass,
    BannedUsersSchema,
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    UsersAccountSchema,
} from "./users/users.schema";
import { DeleteUserUseCase } from "./users/use-cases/delete-user-use-case";
import { CreateUserUseCase } from "./users/use-cases/create-user-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "../auth/use-cases/create-user-without-confirmation-email-use-case";
import { UsersRepository } from "./users/users.repository";
import { AuthService } from "../auth/auth.service";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { BanUnbanUserUseCase } from "./users/use-cases/ban-unban-user-use-case";
import { GetAllBlogsWithAdditionalInfoQuery } from "../blogs/use-cases/queries/get-all-blogs-with-additional-info-query";
import { GetUserByIdQuery } from "./users/use-cases/queries/get-user-by-id-query";

const useCases = [
    BindUserWithBlogUseCase,
    DeleteUserUseCase,
    CreateUserUseCase,
    CreateUserWithoutConfirmationEmailUseCase,
    BanUnbanUserUseCase,
];

const queries = [GetAllBlogsWithAdditionalInfoQuery, GetUserByIdQuery];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
            {
                name: PostClass.name,
                schema: PostsSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: UserAccountEmailClass.name,
                schema: UserAccountEmailSchema,
            },
            {
                name: UserDevicesDataClass.name,
                schema: UserDevicesDataSchema,
            },
            {
                name: EmailRecoveryCodeClass.name,
                schema: EmailRecoveryCodeSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
            {
                name: BanInfoClass.name,
                schema: BanInfoSchema,
            },
            {
                name: BannedUsersClass.name,
                schema: BannedUsersSchema,
            },
        ]),
    ],
    controllers: [SuperAdminController],
    providers: [
        AuthService,
        BcryptService,
        BlogsRepository,
        BlogsQueryRepository,
        UsersQueryRepository,
        UsersRepository,
        IsBlogsIdExistConstraint,
        IsUsersIdExistConstraint,
        IsLoginExistConstraint,
        IsEmailExistConstraint,
        ...useCases,
        ...queries,
    ],
})
export class SuperAdminModule {}
