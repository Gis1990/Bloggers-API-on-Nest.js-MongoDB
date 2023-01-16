import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UsersLikesInfoClass, UsersLikesInfoSchema } from "../posts/posts.schema";
import { CommentViewModelClass } from "./entities/comments.entity";
import { OwnerInfoClass, OwnerInfoSchema } from "../blogs/blogs.schema";

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
export class PostInfoClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    title: string;
    @Prop({
        required: true,
    })
    blogId: string;
    @Prop({
        required: true,
    })
    blogName: string;
}

export const PostInfoSchema = SchemaFactory.createForClass(PostInfoClass);

@Schema({ versionKey: false })
export class CommentClass {
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
    @Prop({
        type: OwnerInfoSchema,
        required: true,
        _id: false,
    })
    commentatorInfo: OwnerInfoClass;
    @Prop({
        type: PostInfoSchema,
        required: true,
        _id: false,
    })
    postInfo: PostInfoClass;

    async returnUsersLikeStatusForComments(userId: string): Promise<string> {
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

    async getLikesDataInfoForComment(userId: string | undefined, bannedUsers: string[]): Promise<CommentClass> {
        if (bannedUsers.length > 0) {
            this.likesInfo.likesCount = this.usersLikesInfo.usersWhoPutLike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
            this.likesInfo.dislikesCount = this.usersLikesInfo.usersWhoPutDislike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
        }
        if (userId) {
            this.likesInfo.myStatus = await this.returnUsersLikeStatusForComments(userId);
        } else {
            this.likesInfo.myStatus = "None";
        }
        return this;
    }

    async transformToCommentViewModelClass(): Promise<CommentViewModelClass> {
        return new CommentViewModelClass(
            this.id,
            this.content,
            this.commentatorInfo.userId,
            this.commentatorInfo.userLogin,
            this.createdAt,
            this.likesInfo,
        );
    }
}

export const CommentsSchema = SchemaFactory.createForClass(CommentClass);
CommentsSchema.methods = {
    getLikesDataInfoForComment: CommentClass.prototype.getLikesDataInfoForComment,
    returnUsersLikeStatusForComments: CommentClass.prototype.returnUsersLikeStatusForComments,
};
