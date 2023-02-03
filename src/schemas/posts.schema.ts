import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
        required: true,
    })
    postOwnerId: string;
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
}

export const PostsSchema = SchemaFactory.createForClass(PostClass);
