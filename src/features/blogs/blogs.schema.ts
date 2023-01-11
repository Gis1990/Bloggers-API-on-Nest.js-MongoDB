import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BlogViewModelClass } from "./entities/blogs.entity";

@Schema({ versionKey: false })
export class BlogOwnerInfoClass {
    @Prop({
        required: true,
    })
    userId: string;
    @Prop({
        required: true,
    })
    userLogin: string;
}

export const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfoClass);

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
        type: BlogOwnerInfoSchema,
        required: true,
        _id: false,
    })
    blogOwnerInfo: {
        userId: string;
        userLogin: string;
    };

    async transformToBlogViewModelClass(): Promise<BlogViewModelClass> {
        return new BlogViewModelClass(this.id, this.name, this.description, this.websiteUrl, this.createdAt);
    }
}

export const BlogsSchema = SchemaFactory.createForClass(BlogClass);
BlogsSchema.methods = {
    transformToBlogViewModelClass: BlogClass.prototype.transformToBlogViewModelClass,
};
