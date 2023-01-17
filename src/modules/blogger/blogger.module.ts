import { Module } from "@nestjs/common";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { CreatePostUseCase } from "../../commands/posts/create-post-use-case";
import { PostsRepository } from "../../repositories/posts.repository";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteBlogUseCase } from "../../commands/blogs/delete-blog-use-case";
import { UpdateBlogUseCase } from "../../commands/blogs/update-blog-use-case";
import { CreateBlogUseCase } from "../../commands/blogs/create-blog-use-case";
import { UpdatePostUseCase } from "../../commands/posts/update-post-use-case";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { BlogsRepository } from "../../repositories/blogs.repository";
import {
    IsBlogsIdExistConstraint,
    IsBlogsIdExistInTheRequestBodyConstraint,
} from "../../decorators/blogs/blogs.custom.decorators";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BloggerController } from "./blogger.controller";
import { GetAllBlogsForAuthorizedUserQuery } from "../../queries/blogs/get-all-blogs-for-authorized-user-query";
import {
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UsersAccountSchema,
} from "../../schemas/users.schema";
import { GetAllUsersQuery } from "../../queries/users/get-all-users-query";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { GetUserByIdQuery } from "../../queries/users/get-user-by-id-query";
import { GetAllCommentsForAllPostsForBloggersBlogsQuery } from "../../queries/comments/get-all-comments-for-all-posts-for-blogs-query";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentClass, CommentsSchema } from "../../schemas/comments.schema";
import { GetAllBannedUsersForBlogQuery } from "../../queries/users/get-all-banned-users-for-blog-query";
import { BanUnbanUserByBloggerForBlogUseCase } from "../../commands/users/ban-unban-user-by-blogger-for-blog-use-case";
import { UsersRepository } from "../../repositories/users.repository";

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    BanUnbanUserByBloggerForBlogUseCase,
];
const queries = [
    GetAllBlogsForAuthorizedUserQuery,
    GetAllUsersQuery,
    GetUserByIdQuery,
    GetAllCommentsForAllPostsForBloggersBlogsQuery,
    GetAllBannedUsersForBlogQuery,
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
                name: CommentClass.name,
                schema: CommentsSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
        ]),
    ],
    controllers: [BloggerController],
    providers: [
        BlogsRepository,
        BlogsQueryRepository,
        PostsQueryRepository,
        UsersRepository,
        UsersQueryRepository,
        CommentsQueryRepository,
        PostsRepository,
        IsBlogsIdExistConstraint,
        IsBlogsIdExistInTheRequestBodyConstraint,
        ...useCases,
        ...queries,
    ],
})
export class BloggerModule {}
