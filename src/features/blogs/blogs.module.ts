import { forwardRef, Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogsRepository } from "./blogs.repository";
import { BlogsController } from "./blogs.controller";
import { IsBlogsIdExistConstraint } from "./blogs.custom.decorators";
import { PostsModule } from "../posts/posts.module";
import { BlogsQueryRepository } from "./blogs.query.repository";

@Module({
    imports: [forwardRef(() => PostsModule)],
    controllers: [BlogsController],
    providers: [BlogsService, BlogsRepository, BlogsQueryRepository, IsBlogsIdExistConstraint],
    exports: [BlogsRepository],
})
export class BlogsModule {}
