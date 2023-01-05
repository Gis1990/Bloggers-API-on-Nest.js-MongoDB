import { Module } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogsController } from "./blogs.controller";
import { IsBlogsIdExistConstraint, IsBlogsIdExistInTheRequestBodyConstraint } from "./blogs.custom.decorators";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { PostsQueryRepository } from "../posts/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogDBClass, BlogsSchema } from "./blogs.schema";
import { CreateBlogUseCase } from "./use-cases/create-blog-use-case";
import { UpdateBlogUseCase } from "./use-cases/update-blog-use-case";
import { DeleteBlogUseCase } from "./use-cases/delete-blog-use-case";
import { CreatePostUseCase } from "../posts/use-cases/create-post-use-case";
import { PostsRepository } from "../posts/posts.repository";
import { PostDBClass, PostsSchema } from "../posts/posts.schema";

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, CreatePostUseCase];

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: BlogDBClass.name,
                schema: BlogsSchema,
            },
            {
                name: PostDBClass.name,
                schema: PostsSchema,
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
    ],
    exports: [BlogsRepository],
})
export class BlogsModule {}
