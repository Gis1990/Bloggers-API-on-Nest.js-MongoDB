import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

@Schema({ versionKey: false })
export class NewestLikesClass {
    @ApiProperty({ example: new Date(), description: "The date and time the like was added" })
    @Prop({
        required: true,
    })
    addedAt: Date;

    @ApiProperty({ example: uuidv4(), description: "The ID of the user who added the like" })
    @Prop({
        required: true,
    })
    userId: string;

    @ApiProperty({ type: String, description: "The login of the user who added the like" })
    @Prop({
        required: true,
    })
    login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikesClass);

@Schema({ versionKey: false })
export class ExtendedLikesInfoClass {
    @ApiProperty({ example: 10, description: "The number of likes received by the comment or post" })
    @Prop({
        default: 0,
        required: true,
    })
    likesCount: number;

    @ApiProperty({ example: 2, description: "The number of dislikes received by the comment or post" })
    @Prop({
        default: 0,
        required: true,
    })
    dislikesCount: number;

    @ApiProperty({
        example: "None",
        description:
            'The status of the current user in relation to the comment or post (e.g. "Liked", "Disliked", "None")',
        enum: ["Liked", "Disliked", "None"],
    })
    @Prop({
        default: "None",
        required: true,
    })
    myStatus: string;
    @ApiProperty({ type: [NewestLikesClass], description: "The newest likes received by the post" })
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
export class ImagesInfoClass {
    @ApiProperty({ type: String, description: "Photo url" })
    @Prop()
    url: string;

    @ApiProperty({ example: 500, description: "Width in px" })
    @Prop()
    width: number;

    @ApiProperty({ example: 500, description: "Height in px" })
    @Prop()
    height: number;

    @ApiProperty({ example: 500, description: "FileSize in bytes" })
    @Prop()
    fileSize: number;
}

export const ImagesInfoSchema = SchemaFactory.createForClass(ImagesInfoClass);

@Schema({ versionKey: false })
export class ImagesForPostsClass {
    @ApiProperty({ type: [ImagesInfoClass], required: true })
    @Prop({ type: [ImagesInfoSchema], _id: false })
    main: ImagesInfoClass[];
}

export const ImagesForPostsSchema = SchemaFactory.createForClass(ImagesForPostsClass);

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

    @Prop({
        required: true,
        _id: false,
        type: ImagesForPostsSchema,
    })
    images: ImagesForPostsClass;
}

export const PostsSchema = SchemaFactory.createForClass(PostClass);
