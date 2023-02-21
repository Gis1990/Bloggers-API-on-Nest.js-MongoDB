import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { SuperAdminController } from "./super.admin.controller";
import { BindUserWithBlogUseCase } from "../../commands/users/bind-user-with-blog-use-case";
import {
    IsEmailExistConstraint,
    IsLoginExistConstraint,
    IsUsersIdExistConstraint,
} from "../../decorators/users/users.custom.decorators";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import {
    IsBlogsIdExistConstraint,
    IsBlogsIdExistForBanUnbanOperationConstraint,
} from "../../decorators/blogs/blogs.custom.decorators";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import {
    BanInfoClass,
    BanInfoSchema,
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
} from "../../schemas/users.schema";
import { DeleteUserUseCase } from "../../commands/users/delete-user-use-case";
import { CreateUserUseCase } from "../../commands/users/create-user-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "../../commands/auth/create-user-without-confirmation-email-use-case";
import { UsersRepository } from "../../repositories/users.repository";
import { AuthService } from "../auth/auth.service";
import { BcryptService } from "../utils/bcrypt/bcrypt.service";
import { BanUnbanUserBySuperAdminUseCase } from "../../commands/users/ban-unban-user-by-super-admin-use-case";
import { GetAllBlogsForSuperAdminQuery } from "../../queries/blogs/get-all-blogs-for-super-admin-query";
import { GetUserByIdQuery } from "../../queries/users/get-user-by-id-query";
import { BanUnbanBlogBySuperAdminUseCase } from "../../commands/blogs/ban-unban-blog-by-super-admin-use-case";
import { GetBlogByIdForBanUnbanOperationQuery } from "../../queries/blogs/get-blog-by-id-for-ban-unban-operation-query";
import { QuestionClass, QuestionSchema } from "../../schemas/questions.schema";
import { CreateQuestionUseCase } from "../../commands/quiz/create-question-use-case";
import { GetAllQuestionsQuery } from "../../queries/quiz/get-all-questions-query";
import { GetQuestionByIdQuery } from "../../queries/quiz/get-question-by-id-query";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { IsQuestionIdExistConstraint } from "../../decorators/quiz/questions.custom.decorators";
import { DeleteQuestionUseCase } from "../../commands/quiz/delete-question-use-case";
import { UpdateQuestionUseCase } from "../../commands/quiz/update-question-use-case";
import { PublishUnpublishQuestionUseCase } from "../../commands/quiz/publish-unpublish-question-use-case";

const useCases = [
    BindUserWithBlogUseCase,
    DeleteUserUseCase,
    CreateUserUseCase,
    CreateUserWithoutConfirmationEmailUseCase,
    BanUnbanUserBySuperAdminUseCase,
    BanUnbanBlogBySuperAdminUseCase,
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    UpdateQuestionUseCase,
    PublishUnpublishQuestionUseCase,
];

const queries = [
    GetAllBlogsForSuperAdminQuery,
    GetUserByIdQuery,
    GetBlogByIdForBanUnbanOperationQuery,
    GetAllQuestionsQuery,
    GetQuestionByIdQuery,
];

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
                name: QuestionClass.name,
                schema: QuestionSchema,
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
        QuizRepository,
        QuizQueryRepository,
        IsBlogsIdExistConstraint,
        IsUsersIdExistConstraint,
        IsBlogsIdExistForBanUnbanOperationConstraint,
        IsLoginExistConstraint,
        IsEmailExistConstraint,
        IsQuestionIdExistConstraint,
        ...useCases,
        ...queries,
    ],
})
export class SuperAdminModule {}
