import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { UsersLikesInfoClass, UsersLikesInfoSchema } from "../posts/posts.schema";

@Schema({ versionKey: false })
export class LikesInfoClass {
    @Prop({
        default: 0,
        required: true,
    })
    likesCount: number;
    @Prop({
        default: 0,
        required: true,
    })
    dislikesCount: number;
    @Prop({
        default: "None",
        required: true,
    })
    myStatus: string;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfoClass);

@Schema({ versionKey: false })
export class CommentDBClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    content: string;
    @Prop({
        required: true,
    })
    userId: string;
    @Prop({
        required: true,
    })
    userLogin: string;
    @Prop({
        required: true,
    })
    postId: string;
    @Prop({
        required: true,
    })
    createdAt: Date;
    @Prop({
        type: LikesInfoSchema,
        required: true,
        default: LikesInfoClass,
        _id: false,
    })
    likesInfo: LikesInfoClass;
    @Prop({
        type: UsersLikesInfoSchema,
        required: true,
        default: UsersLikesInfoClass,
        _id: false,
    })
    usersLikesInfo: UsersLikesInfoClass;

    returnUsersLikeStatusForComments(userId: string): string {
        const isLiked = this.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = this.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }

    getLikesDataInfoForComment(userId: string | undefined): CommentDBClass {
        if (!this) {
            throw new NotFoundException();
        }
        if (userId) {
            this.likesInfo.myStatus = this.returnUsersLikeStatusForComments(userId);
        } else {
            this.likesInfo.myStatus = "None";
        }
        return this;
    }
}

export const CommentsSchema = SchemaFactory.createForClass(CommentDBClass);
CommentsSchema.methods = {
    getLikesDataInfoForComment: CommentDBClass.prototype.getLikesDataInfoForComment,
    returnUsersLikeStatusForComments: CommentDBClass.prototype.returnUsersLikeStatusForComments,
};
export type CommentDocument = HydratedDocument<CommentDBClass>;
