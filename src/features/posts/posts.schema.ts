import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ versionKey: false })
export class NewestLikesClass {
    @Prop({
        required: true,
    })
    addedAt: Date;
    @Prop({
        required: true,
    })
    userId: string;
    @Prop({
        required: true,
    })
    login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikesClass);

@Schema({ versionKey: false })
export class ExtendedLikesInfoClass {
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
    @Prop({
        type: [NewestLikesSchema],
        required: true,
        default: [],
        _id: false,
    })
    newestLikes: NewestLikesClass[];
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfoClass);

@Schema({ versionKey: false })
export class UsersLikesInfoClass {
    @Prop({
        required: true,
        default: [],
    })
    usersWhoPutLike: string[];
    @Prop({
        required: true,
        default: [],
    })
    usersWhoPutDislike: string[];
}

export const UsersLikesInfoSchema = SchemaFactory.createForClass(UsersLikesInfoClass);

@Schema({ versionKey: false })
export class PostDBClass {
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
    shortDescription: string;
    @Prop({
        required: true,
    })
    content: string;
    @Prop({
        required: true,
    })
    blogId: string;
    @Prop({
        required: true,
    })
    blogName: string;
    @Prop({
        required: true,
    })
    createdAt: Date;
    @Prop({
        type: ExtendedLikesInfoSchema,
        required: true,
        default: ExtendedLikesInfoClass,
        _id: false,
    })
    extendedLikesInfo: ExtendedLikesInfoClass;
    @Prop({
        type: UsersLikesInfoSchema,
        required: true,
        default: UsersLikesInfoClass,
        _id: false,
    })
    usersLikesInfo: UsersLikesInfoClass;

    returnUsersLikeStatusForPosts(userId: string): string {
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

    getLikesDataInfoForPost(userId: string | undefined): PostDBClass {
        this.extendedLikesInfo.newestLikes = this.extendedLikesInfo.newestLikes
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        if (userId) {
            this.extendedLikesInfo.myStatus = this.returnUsersLikeStatusForPosts(userId);
        } else {
            this.extendedLikesInfo.myStatus = "None";
        }
        return this;
    }
}

export const PostsSchema = SchemaFactory.createForClass(PostDBClass);
PostsSchema.methods = {
    getLikesDataInfoForPost: PostDBClass.prototype.getLikesDataInfoForPost,
    returnUsersLikeStatusForPosts: PostDBClass.prototype.returnUsersLikeStatusForPosts,
};
export type PostDocument = HydratedDocument<PostDBClass>;
