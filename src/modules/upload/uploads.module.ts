import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { SaveWallpaperForBlogUseCase } from "../../commands/blogs/save-wallpaper-for-blog-use-case";
import { S3StorageAdapter } from "./files.storage.adapter.service";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";

const useCases = [SaveWallpaperForBlogUseCase];
const queries = [];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
        ]),
    ],
    controllers: [UploadsController],
    providers: [BlogsRepository, BlogsQueryRepository, ...useCases, ...queries, S3StorageAdapter],
})
export class UploadsModule {}
