import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import { PostsQueryRepository } from "./posts.query.repository";
import { PostsRepository } from "./posts.repository";
import { BlogsModule } from "../blogs/blogs.module";
import { IsBlogsIdExistInTheRequestBodyConstraint } from "../blogs/blogs.custom.decorators";
import { CommentsRepository } from "../comments/comments.repository";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { CommentsQueryRepository } from "../comments/comments.query.repository";
import { BlogDBClass, BlogsSchema } from "../blogs/blogs.schema";
import { CommentDBClass, CommentsSchema } from "../comments/comments.schema";
import { IsPostIdExistConstraint } from "./posts.custom.decorators";
import { CreatePostUseCase } from "./use-cases/create-post-use-case";
import { DeletePostUseCase } from "./use-cases/delete-post-use-case";
import { UpdatePostUseCase } from "./use-cases/update-post-use-case";
import { LikeOperationForPostUseCase } from "./use-cases/like-operation-for-post-use-case";
import { NewestLikesClass, NewestLikesSchema, PostDBClass, PostsSchema } from "./posts.schema";
import { CreateCommentUseCase } from "../comments/use-cases/create-comment-use-case";

const useCases = [
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    LikeOperationForPostUseCase,
    CreateCommentUseCase,
];

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
        PostsRepository,
        PostsQueryRepository,
        CommentsRepository,
        CommentsQueryRepository,
        BlogsQueryRepository,
        IsBlogsIdExistInTheRequestBodyConstraint,
        IsPostIdExistConstraint,
        ...useCases,
    ],

    exports: [],
})
export class PostsModule {}
