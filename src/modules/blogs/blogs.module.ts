import { Module } from "@nestjs/common";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { BlogsController } from "./blogs.controller";
import {
    IsBlogsIdExistConstraint,
    IsBlogsIdExistInTheRequestBodyConstraint,
} from "../../decorators/blogs/blogs.custom.decorators";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { CreateBlogUseCase } from "../../commands/blogs/create-blog-use-case";
import { UpdateBlogUseCase } from "../../commands/blogs/update-blog-use-case";
import { DeleteBlogUseCase } from "../../commands/blogs/delete-blog-use-case";
import { CreatePostUseCase } from "../../commands/posts/create-post-use-case";
import { PostsRepository } from "../../repositories/posts.repository";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllBlogsQuery } from "../../queries/blogs/get-all-blogs-query";
import { GetBlogByIdQuery } from "../../queries/blogs/get-blog-by-id-query";
import { GetBlogByIdWithCorrectViewModelQuery } from "../../queries/blogs/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogQuery } from "../../queries/posts/get-all-posts-for-specific-blog-query";
import { UserAccountClass, UsersAccountSchema } from "../../schemas/users.schema";
import { GetUserByIdQuery } from "../../queries/users/get-user-by-id-query";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { SubscribeUserForBlogUseCase } from "../../commands/blogs/subscribe-user-for-blog-use-case";
import { UnsubscribeUserForBlogUseCase } from "../../commands/blogs/unsubscribe-user-for-blog-use-case";
import { TelegramAdapter } from "../utils/telegram/telagram.adapter";
// import { SubscribeUserForBlogUseCase } from "../../commands/blogs/subscribe-user-for-blog-use-case";

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    SubscribeUserForBlogUseCase,
    UnsubscribeUserForBlogUseCase,
];
const queries = [
    GetAllBlogsQuery,
    GetBlogByIdQuery,
    GetBlogByIdWithCorrectViewModelQuery,
    GetAllPostsForSpecificBlogQuery,
    GetUserByIdQuery,
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
        ]),
    ],
    controllers: [BlogsController],
    providers: [
        BlogsRepository,
        BlogsQueryRepository,
        PostsRepository,
        PostsQueryRepository,
        UsersQueryRepository,
        IsBlogsIdExistConstraint,
        IsBlogsIdExistInTheRequestBodyConstraint,
        TelegramAdapter,
        ...useCases,
        ...queries,
    ],
    exports: [BlogsRepository, BlogsQueryRepository],
})
export class BlogsModule {}
