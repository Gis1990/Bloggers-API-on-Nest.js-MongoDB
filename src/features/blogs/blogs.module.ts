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
import { BannedUsersClass, BannedUsersSchema } from "../users/users.schema";

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, CreatePostUseCase];
const queries = [
    GetAllBlogsQuery,
    GetBlogByIdQuery,
    GetBlogByIdWithCorrectViewModelQuery,
    GetAllPostsForSpecificBlogQuery,
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
                name: BannedUsersClass.name,
                schema: BannedUsersSchema,
            },
        ]),
    ],
    controllers: [BlogsController],
    providers: [
        BlogsRepository,
        BlogsQueryRepository,
        PostsQueryRepository,
        PostsRepository,
        IsBlogsIdExistConstraint,
        IsBlogsIdExistInTheRequestBodyConstraint,
        ...useCases,
        ...queries,
    ],
    exports: [BlogsRepository],
})
export class BlogsModule {}
