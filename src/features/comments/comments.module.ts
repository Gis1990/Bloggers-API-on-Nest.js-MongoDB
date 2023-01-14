import { forwardRef, Module } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { IsCommentsIdExistConstraint } from "./decorators/comments.custom.decorators";
import { CommentsQueryRepository } from "./comments.query.repository";
import { PostsModule } from "../posts/posts.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentClass, CommentsSchema } from "./comments.schema";
import { PostClass, PostsSchema } from "../posts/posts.schema";
import { CreateCommentUseCase } from "./use-cases/create-comment-use-case";
import { UpdateCommentUseCase } from "./use-cases/update-comment-use-case";
import { DeleteCommentUseCase } from "./use-cases/delete-comment-use-case";
import { LikeOperationForCommentUseCase } from "./use-cases/like-operation-for-comment-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { GetCommentByIdQuery } from "./use-cases/queries/get-comment-by-id-query";
import { BannedUsersAndBlogsClass, BannedUsersSchema } from "../super-admin/users/users.schema";
import { GetCommentByIdForLikeOperationQuery } from "./use-cases/queries/get-comment-by-id-for-like-operation-query";
import { GetAllCommentsForSpecificPostQuery } from "./use-cases/queries/get-all-comments-for-specific-post-query";
import { GetCommentForIdValidationQuery } from "./use-cases/queries/get-comment-for-id-validation-query";
import { BlogClass, BlogsSchema } from "../blogs/blogs.schema";

const useCases = [CreateCommentUseCase, UpdateCommentUseCase, DeleteCommentUseCase, LikeOperationForCommentUseCase];

const queries = [
    GetCommentByIdQuery,
    GetCommentByIdForLikeOperationQuery,
    GetAllCommentsForSpecificPostQuery,
    GetCommentForIdValidationQuery,
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
                name: BannedUsersAndBlogsClass.name,
                schema: BannedUsersSchema,
            },
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
        ]),
    ],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsQueryRepository, IsCommentsIdExistConstraint, ...useCases, ...queries],
})
export class CommentsModule {}
