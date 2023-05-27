import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { ImagesForPostsClass, ImagesInfoClass, ImagesInfoSchema } from "./posts.schema";

@Schema({ versionKey: false })
export class OwnerInfoClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the user" })
    @Prop({
        required: true,
    })
    userId: string;

    @ApiProperty({ example: "user1", description: "The username for the user" })
    @Prop({
        required: true,
    })
    userLogin: string;
}

export const OwnerInfoSchema = SchemaFactory.createForClass(OwnerInfoClass);

@Schema({ versionKey: false })
export class ImagesForBlogsClass extends ImagesForPostsClass {
    @ApiProperty({ type: ImagesInfoClass, required: true })
    @Prop({ type: ImagesInfoSchema, _id: false })
    wallpaper: ImagesInfoClass;
}

export const ImagesForBlogsSchema = SchemaFactory.createForClass(ImagesForBlogsClass);

@Schema({ versionKey: false })
export class BanInfoClassForBlog {
    @ApiProperty({ example: true, required: true })
    @Prop({
        required: true,
    })
    isBanned: boolean;
    @ApiProperty({ example: new Date(), required: true })
    @Prop()
    banDate: Date;
}

export const BanInfoSchemaForBlog = SchemaFactory.createForClass(BanInfoClassForBlog);

@Schema({ versionKey: false })
export class BlogClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    name: string;
    @Prop({
        required: true,
    })
    description: string;
    @Prop({
        required: true,
    })
    websiteUrl: string;
    @Prop({
        required: true,
    })
    createdAt: Date;
    @Prop({
        type: OwnerInfoSchema,
        required: true,
        _id: false,
    })
    blogOwnerInfo: OwnerInfoClass;

    @Prop({
        type: BanInfoSchemaForBlog,
        required: true,
        _id: false,
    })
    banInfo: BanInfoClassForBlog;
    @Prop({
        required: true,
    })
    isMembership: boolean;
    @Prop({
        required: true,
        _id: false,
        type: ImagesForBlogsSchema,
    })
    images: ImagesForBlogsClass;
    @Prop({
        required: true,
        _id: false,
    })
    subscribers: string[];
    @Prop({
        required: true,
        default: 0,
    })
    subscribersCount: number;
    @Prop({
        required: true,
        default: "None",
    })
    currentUserSubscriptionStatus: string;
}

export const BlogsSchema = SchemaFactory.createForClass(BlogClass);
