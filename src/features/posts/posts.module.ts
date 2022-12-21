import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { BlogsModule } from "../blogs/blogs.module";
import { IsBlogsIdExistConstraint } from "../blogs/blogs.custom.decorators";
import { IsPostIdExistExistConstraint } from "./posts.custom.decorators";
import { BlogsService } from "../blogs/blogs.service";
import { CommentsService } from "../comments/comments.service";
import { CommentsRepository } from "../comments/comments.repository";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { PostsQueryRepository } from "./posts.query.repository";
import { PostsQueryService } from "./posts.query.service";

@Module({
    imports: [forwardRef(() => BlogsModule)],
    controllers: [PostsController],
    providers: [
        PostsService,
        PostsQueryService,
        PostsRepository,
        PostsQueryRepository,
        BlogsService,
        CommentsService,
        CommentsRepository,
        BlogsQueryRepository,

        IsBlogsIdExistConstraint,
        IsPostIdExistExistConstraint,
    ],

    exports: [PostsService],
})
export class PostsModule {}
