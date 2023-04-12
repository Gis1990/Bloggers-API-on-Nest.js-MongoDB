import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { SaveWallpaperForBlogUseCase } from "../../commands/blogs/save-wallpaper-for-blog-use-case";
import { S3StorageAdapter } from "./files.storage.adapter.service";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { SaveMainImageForBlogUseCase } from "../../commands/blogs/save-main-image-for-blog-use-case";
import { SaveMainImageForPostUseCase } from "../../commands/posts/save-main-image-for-post-use-case";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { PostsRepository } from "../../repositories/posts.repository";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";

const useCases = [SaveWallpaperForBlogUseCase, SaveMainImageForBlogUseCase, SaveMainImageForPostUseCase];
const queries = [];

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
        ]),
    ],
    controllers: [UploadsController],
    providers: [
        BlogsRepository,
        BlogsQueryRepository,
        PostsRepository,
        PostsQueryRepository,
        ...useCases,
        ...queries,
        S3StorageAdapter,
    ],
})
export class UploadsModule {}
