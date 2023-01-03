import { forwardRef, Module } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { IsCommentsIdExistConstraint } from "./comments.custom.decorators";
import { CommentsQueryRepository } from "./comments.query.repository";
import { PostsModule } from "../posts/posts.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostDBClass, PostsSchema } from "../posts/postsSchema";
import { CommentDBClass, CommentsSchema } from "./comments.schema";

@Module({
    imports: [
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
    providers: [CommentsService, CommentsRepository, CommentsQueryRepository, IsCommentsIdExistConstraint],
})
export class CommentsModule {}
