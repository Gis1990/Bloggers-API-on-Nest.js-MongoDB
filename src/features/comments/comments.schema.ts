import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UsersLikesInfoClass, UsersLikesInfoSchema } from "../posts/postsSchema";

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
}

export const CommentsSchema = SchemaFactory.createForClass(CommentDBClass);
export type CommentDocument = HydratedDocument<CommentDBClass>;
