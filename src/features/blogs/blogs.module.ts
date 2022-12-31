import { forwardRef, Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogsRepository } from "./blogs.repository";
import { BlogsController } from "./blogs.controller";
import { IsBlogsIdExistConstraint, IsBlogsIdExistInTheRequestBodyConstraint } from "./blogs.custom.decorators";
import { PostsModule } from "../posts/posts.module";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { PostsQueryService } from "../posts/posts.query.service";
import { PostsQueryRepository } from "../posts/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogDBClass, BlogsSchema } from "./blogs.schema";
import { PostDBClass, PostsSchema } from "../posts/posts.schema";

@Module({
    imports: [
        forwardRef(() => PostsModule),
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
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        PostsQueryService,
        PostsQueryRepository,
        IsBlogsIdExistConstraint,
        IsBlogsIdExistInTheRequestBodyConstraint,
    ],
    exports: [BlogsRepository],
})
export class BlogsModule {}
