import { Module } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogsController } from "./blogs.controller";
import {
    IsBlogsIdExistConstraint,
    IsBlogsIdExistInTheRequestBodyConstraint,
} from "./decorators/blogs.custom.decorators";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { PostsQueryRepository } from "../posts/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "./blogs.schema";
import { CreateBlogUseCase } from "./use-cases/create-blog-use-case";
import { UpdateBlogUseCase } from "./use-cases/update-blog-use-case";
import { DeleteBlogUseCase } from "./use-cases/delete-blog-use-case";
import { CreatePostUseCase } from "../posts/use-cases/create-post-use-case";
import { PostsRepository } from "../posts/posts.repository";
import { PostClass, PostsSchema } from "../posts/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllBlogsQuery } from "./use-cases/queries/get-all-blogs-query";
import { GetBlogByIdQuery } from "./use-cases/queries/get-blog-by-id-query";
import { GetBlogByIdWithCorrectViewModelQuery } from "./use-cases/queries/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogQuery } from "../posts/use-cases/queries/get-all-posts-for-specific-blog-query";
import {
    BannedBlogsBySuperAdminClass,
    BannedBlogsBySuperAdminSchema,
    BannedUsersBySuperAdminClass,
    BannedUsersSchema,
    UserAccountClass,
    UsersAccountSchema,
} from "../super-admin/users/users.schema";
import { GetUserByIdQuery } from "../super-admin/users/use-cases/queries/get-user-by-id-query";
import { UsersQueryRepository } from "../super-admin/users/users.query.repository";

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, CreatePostUseCase];
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
                name: BannedUsersBySuperAdminClass.name,
                schema: BannedUsersSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: BannedBlogsBySuperAdminClass.name,
                schema: BannedBlogsBySuperAdminSchema,
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
        ...useCases,
        ...queries,
    ],
    exports: [BlogsRepository, BlogsQueryRepository],
})
export class BlogsModule {}
