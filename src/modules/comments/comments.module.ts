import { forwardRef, Module } from "@nestjs/common";
import { CommentsRepository } from "../../repositories/comments.repository";
import { CommentsController } from "./comments.controller";
import { IsCommentsIdExistConstraint } from "../../decorators/comments/comments.custom.decorators";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { PostsModule } from "../posts/posts.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentClass, CommentsSchema } from "../../schemas/comments.schema";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CreateCommentUseCase } from "../../commands/comments/create-comment-use-case";
import { UpdateCommentUseCase } from "../../commands/comments/update-comment-use-case";
import { DeleteCommentUseCase } from "../../commands/comments/delete-comment-use-case";
import { LikeOperationForCommentUseCase } from "../../commands/comments/like-operation-for-comment-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { GetCommentByIdQuery } from "../../queries/comments/get-comment-by-id-query";
import { GetCommentByIdForLikeOperationQuery } from "../../queries/comments/get-comment-by-id-for-like-operation-query";
import { GetAllCommentsForSpecificPostQuery } from "../../queries/comments/get-all-comments-for-specific-post-query";
import { GetCommentForIdValidationQuery } from "../../queries/comments/get-comment-for-id-validation-query";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { UserAccountClass, UsersAccountSchema } from "../../schemas/users.schema";
import { GetAllBannedBlogsQuery } from "../../queries/blogs/get-all-banned-blogs-query";
import { GetAllBannedUsersBySuperAdminQuery } from "../../queries/users/get-all-banned-users-by-super-admin-query";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

const useCases = [CreateCommentUseCase, UpdateCommentUseCase, DeleteCommentUseCase, LikeOperationForCommentUseCase];

const queries = [
    GetCommentByIdQuery,
    GetCommentByIdForLikeOperationQuery,
    GetAllCommentsForSpecificPostQuery,
    GetCommentForIdValidationQuery,
    GetAllBannedBlogsQuery,
    GetAllBannedUsersBySuperAdminQuery,
];

@Module({
    imports: [
        CqrsModule,
        forwardRef(() => PostsModule),
        MongooseModule.forFeature([
            {
                name: CommentClass.name,
                schema: CommentsSchema,
            },
            {
                name: PostClass.name,
                schema: PostsSchema,
            },
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
        ]),
    ],
    controllers: [CommentsController],
    providers: [
        CommentsRepository,
        CommentsQueryRepository,
        BlogsQueryRepository,
        UsersQueryRepository,
        IsCommentsIdExistConstraint,
        ...useCases,
        ...queries,
    ],
})
export class CommentsModule {}
