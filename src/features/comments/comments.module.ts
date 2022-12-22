import { Module } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { IsCommentsIdExistConstraint } from "./comments.custom.decorators";
import { CommentsQueryRepository } from "./comments.query.repository";

@Module({
    controllers: [CommentsController],
    providers: [CommentsService, CommentsRepository, CommentsQueryRepository, IsCommentsIdExistConstraint],
})
export class CommentsModule {}
