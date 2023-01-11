import { Module } from "@nestjs/common";
import { PostsQueryRepository } from "../posts/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { CreatePostUseCase } from "../posts/use-cases/create-post-use-case";
import { PostsRepository } from "../posts/posts.repository";
import { PostClass, PostsSchema } from "../posts/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteBlogUseCase } from "../blogs/use-cases/delete-blog-use-case";
import { UpdateBlogUseCase } from "../blogs/use-cases/update-blog-use-case";
import { CreateBlogUseCase } from "../blogs/use-cases/create-blog-use-case";
import { UpdatePostUseCase } from "../posts/use-cases/update-post-use-case";
import { BlogClass, BlogsSchema } from "../blogs/blogs.schema";
import { BlogsRepository } from "../blogs/blogs.repository";
import {
    IsBlogsIdExistConstraint,
    IsBlogsIdExistInTheRequestBodyConstraint,
} from "../blogs/decorators/blogs.custom.decorators";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { BloggerController } from "./blogger.controller";
import { GetAllBlogsForAuthorizedUserQuery } from "../blogs/use-cases/queries/get-all-blogs-for-authorized-user-query";
import { BannedUsersClass, BannedUsersSchema } from "../users/users.schema";

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, CreatePostUseCase, UpdatePostUseCase];
const queries = [GetAllBlogsForAuthorizedUserQuery];

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
    controllers: [BloggerController],
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
})
export class BloggerModule {}
