import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { BloggersModule } from "../bloggers/bloggers.module";
import { IsBloggersIdExistConstraint } from "../bloggers/bloggers.custom.decorators";
import { IsPostIdExistExistConstraint } from "./posts.custom.decorators";
import { BloggersService } from "../bloggers/bloggers.service";
import { CommentsService } from "../comments/comments.service";
import { CommentsRepository } from "../comments/comments.repository";

@Module({
    imports: [forwardRef(() => BloggersModule)],
    controllers: [PostsController],
    providers: [
        PostsService,
        PostsRepository,
        BloggersService,
        CommentsService,
        CommentsRepository,
        IsBloggersIdExistConstraint,
        IsPostIdExistExistConstraint,
    ],
    exports: [PostsService],
})
export class PostsModule {}
