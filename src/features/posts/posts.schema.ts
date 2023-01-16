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
    transformToPostViewModelClass: PostClass.prototype.transformToPostViewModelClass,
};
