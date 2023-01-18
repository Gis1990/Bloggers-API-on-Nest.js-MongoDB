import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { PostsRepository } from "../../repositories/posts.repository";
import { BlogsModule } from "../blogs/blogs.module";
import { IsBlogsIdExistInTheRequestBodyConstraint } from "../../decorators/blogs/blogs.custom.decorators";
import { CommentsRepository } from "../../repositories/comments.repository";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { CommentClass, CommentsSchema } from "../../schemas/comments.schema";
import { IsPostIdExistConstraint } from "../../decorators/posts/posts.custom.decorators";
import { DeletePostUseCase } from "../../commands/posts/delete-post-use-case";
import { UpdatePostUseCase } from "../../commands/posts/update-post-use-case";
import { LikeOperationForPostUseCase } from "../../commands/posts/like-operation-for-post-use-case";
import { NewestLikesClass, NewestLikesSchema, PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CreateCommentUseCase } from "../../commands/comments/create-comment-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { GetBlogByIdQuery } from "../../queries/blogs/get-blog-by-id-query";
import { UserAccountClass, UsersAccountSchema } from "../../schemas/users.schema";
import { GetAllCommentsForSpecificPostQuery } from "../../queries/comments/get-all-comments-for-specific-post-query";
import { GetAllPostsQuery } from "../../queries/posts/get-all-posts-query";
import { GetPostByIdQuery } from "../../queries/posts/get-post-by-id-query";
import { GetPostByIdForLikeOperationQuery } from "../../queries/posts/get-post-by-id-for-like-opertation-query";
import { GetUserByIdQuery } from "../../queries/users/get-user-by-id-query";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { GetAllBannedUsersBySuperAdminQuery } from "../../queries/users/get-all-banned-users-by-super-admin-query";
import { GetAllBannedBlogsQuery } from "../../queries/blogs/get-all-banned-blogs-query";

const useCases = [UpdatePostUseCase, DeletePostUseCase, LikeOperationForPostUseCase, CreateCommentUseCase];
const queries = [
    GetBlogByIdQuery,
    GetAllCommentsForSpecificPostQuery,
    GetAllPostsQuery,
    GetPostByIdQuery,
    GetPostByIdForLikeOperationQuery,
    GetUserByIdQuery,
    GetAllBannedUsersBySuperAdminQuery,
    GetAllBannedBlogsQuery,
];

@Module({
    imports: [
        CqrsModule,
        forwardRef(() => BlogsModule),
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
                name: CommentClass.name,
                schema: CommentsSchema,
            },
            {
                name: NewestLikesClass.name,
                schema: NewestLikesSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
        ]),
    ],
    controllers: [PostsController],
    providers: [
        PostsRepository,
        PostsQueryRepository,
        CommentsRepository,
        CommentsQueryRepository,
        UsersQueryRepository,
        IsBlogsIdExistInTheRequestBodyConstraint,
        IsPostIdExistConstraint,
        ...useCases,
        ...queries,
    ],

    exports: [PostsQueryRepository, PostsRepository],
})
export class PostsModule {}
