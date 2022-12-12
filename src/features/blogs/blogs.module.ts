import { forwardRef, Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogsRepository } from "./blogs.repository";
import { BlogsController } from "./blogs.controller";
import { IsBlogsIdExistConstraint } from "./blogs.custom.decorators";
import { PostsModule } from "../posts/posts.module";

@Module({
    imports: [forwardRef(() => PostsModule)],
    controllers: [BlogsController],
    providers: [BlogsService, BlogsRepository, IsBlogsIdExistConstraint],
    exports: [BlogsRepository],
})
export class BlogsModule {}
