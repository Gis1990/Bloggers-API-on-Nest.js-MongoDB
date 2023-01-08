import { forwardRef, Module } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { IsCommentsIdExistConstraint } from "./comments.custom.decorators";
import { CommentsQueryRepository } from "./comments.query.repository";
import { PostsModule } from "../posts/posts.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentDBClass, CommentsSchema } from "./comments.schema";
import { PostDBClass, PostsSchema } from "../posts/posts.schema";
import { CreateCommentUseCase } from "./use-cases/create-comment-use-case";
import { UpdateCommentUseCase } from "./use-cases/update-comment-use-case";
import { DeleteCommentUseCase } from "./use-cases/delete-comment-use-case";
import { LikeOperationForCommentUseCase } from "./use-cases/like-operation-for-comment-use-case";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [CreateCommentUseCase, UpdateCommentUseCase, DeleteCommentUseCase, LikeOperationForCommentUseCase];

@Module({
    imports: [
        CqrsModule,
        forwardRef(() => PostsModule),
        MongooseModule.forFeature([
            {
                name: CommentDBClass.name,
                schema: CommentsSchema,
            },
            {
                name: PostDBClass.name,
                schema: PostsSchema,
            },
        ]),
    ],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsQueryRepository, IsCommentsIdExistConstraint, ...useCases],
})
export class CommentsModule {}
