import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { BlogsModule } from "../blogs/blogs.module";
import { IsBlogsIdExistInTheRequestBodyConstraint } from "../blogs/blogs.custom.decorators";
import { IsPostIdExistExistConstraint } from "./posts.custom.decorators";
import { BlogsService } from "../blogs/blogs.service";
import { CommentsService } from "../comments/comments.service";
import { CommentsRepository } from "../comments/comments.repository";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { PostsQueryRepository } from "./posts.query.repository";
import { PostsQueryService } from "./posts.query.service";
import { CommentsQueryRepository } from "../comments/comments.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogDBClass, BlogsSchema } from "../blogs/blogs.schema";
import { NewestLikesClass, NewestLikesSchema, PostDBClass, PostsSchema } from "./posts.schema";
import { CommentDBClass, CommentsSchema } from "../comments/comments.schema";

@Module({
    imports: [
        forwardRef(() => BlogsModule),
        MongooseModule.forFeature([
            {
                name: BlogDBClass.name,
                schema: BlogsSchema,
            },
            {
                name: PostDBClass.name,
                schema: PostsSchema,
            },
            {
                name: CommentDBClass.name,
                schema: CommentsSchema,
            },
            {
                name: NewestLikesClass.name,
                schema: NewestLikesSchema,
            },
        ]),
    ],
    controllers: [PostsController],
    providers: [
        PostsService,
        PostsQueryService,
        PostsRepository,
        PostsQueryRepository,
        BlogsService,
        CommentsService,
        CommentsRepository,
        CommentsQueryRepository,
        BlogsQueryRepository,
        IsBlogsIdExistInTheRequestBodyConstraint,
        IsPostIdExistExistConstraint,
    ],

    exports: [PostsService],
})
export class PostsModule {}
