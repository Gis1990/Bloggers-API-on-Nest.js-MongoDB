import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ versionKey: false })
export class BlogDBClass {
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
}

export const BlogsSchema = SchemaFactory.createForClass(BlogDBClass);
export type BlogDocument = HydratedDocument<BlogDBClass>;
