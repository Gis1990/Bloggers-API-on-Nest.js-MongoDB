import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NewestLikesClass, NewestLikesSchema, PostDBClass, PostsSchema } from "./postsSchema";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsQueryRepository } from "./posts.query.repository";
import { PostsRepository } from "./posts.repository";
import { BlogsModule } from "../blogs/blogs.module";
import { IsBlogsIdExistInTheRequestBodyConstraint } from "../blogs/blogs.custom.decorators";
import { BlogsService } from "../blogs/blogs.service";
import { CommentsService } from "../comments/comments.service";
import { CommentsRepository } from "../comments/comments.repository";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { CommentsQueryRepository } from "../comments/comments.query.repository";
import { BlogDBClass, BlogsSchema } from "../blogs/blogs.schema";
import { CommentDBClass, CommentsSchema } from "../comments/comments.schema";
import { IsPostIdExistConstraint } from "./posts.custom.decorators";

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
        PostsRepository,
        PostsQueryRepository,
        BlogsService,
        CommentsService,
        CommentsRepository,
        CommentsQueryRepository,
        BlogsQueryRepository,
        IsBlogsIdExistInTheRequestBodyConstraint,
        IsPostIdExistConstraint,
    ],

    exports: [PostsService],
})
export class PostsModule {}
