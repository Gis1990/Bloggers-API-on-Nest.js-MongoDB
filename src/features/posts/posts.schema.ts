import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostViewModelClass } from "./entities/posts.entity";

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
export class PostClass {
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

    async returnUsersLikeStatusForPosts(userId: string): Promise<string> {
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

    async getLikesDataInfoForPost(userId: string | undefined, bannedUsers: string[]): Promise<PostClass> {
        if (bannedUsers.length > 0) {
            const likesWithoutBannedUsers = this.extendedLikesInfo.newestLikes.filter(
                (elem) => !bannedUsers.includes(elem.userId),
            );
            this.extendedLikesInfo.newestLikes = likesWithoutBannedUsers
                .slice(-3)
                .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
            this.extendedLikesInfo.likesCount = this.usersLikesInfo.usersWhoPutLike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
            this.extendedLikesInfo.dislikesCount = this.usersLikesInfo.usersWhoPutDislike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
        }
        if (userId) {
            this.extendedLikesInfo.myStatus = await this.returnUsersLikeStatusForPosts(userId);
        } else {
            this.extendedLikesInfo.myStatus = "None";
        }
        return this;
    }

    async transformToPostViewModelClass(): Promise<PostViewModelClass> {
        return new PostViewModelClass(
            this.id,
            this.title,
            this.shortDescription,
            this.content,
            this.blogId,
            this.blogName,
            this.createdAt,
            this.extendedLikesInfo,
        );
    }
}

export const PostsSchema = SchemaFactory.createForClass(PostClass);
PostsSchema.methods = {
    getLikesDataInfoForPost: PostClass.prototype.getLikesDataInfoForPost,
    returnUsersLikeStatusForPosts: PostClass.prototype.returnUsersLikeStatusForPosts,
    transformToPostViewModelClass: PostClass.prototype.transformToPostViewModelClass,
};
