import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UsersLikesInfoClass, UsersLikesInfoSchema } from "./posts.schema";
import { OwnerInfoClass, OwnerInfoSchema } from "./blogs.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

@Schema({ versionKey: false })
export class LikesInfoClass {
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
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfoClass);

@Schema({ versionKey: false })
export class PostInfoClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the post" })
    @Prop({
        required: true,
    })
    id: string;

    @ApiProperty({ example: "My post", description: "The title of the post" })
    @Prop({
        required: true,
    })
    title: string;

    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the blog that the post belongs to" })
    @Prop({
        required: true,
    })
    blogId: string;

    @ApiProperty({ example: "My Blog", description: "The name of the blog that the post belongs to" })
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
}

export const CommentsSchema = SchemaFactory.createForClass(CommentClass);
