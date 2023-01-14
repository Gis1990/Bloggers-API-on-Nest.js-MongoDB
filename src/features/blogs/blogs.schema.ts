import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BlogViewModelClass } from "./entities/blogs.entity";

@Schema({ versionKey: false })
export class OwnerInfoClass {
    @Prop({
        required: true,
    })
    userId: string;
    @Prop({
        required: true,
    })
    userLogin: string;
}

export const OwnerInfoSchema = SchemaFactory.createForClass(OwnerInfoClass);

@Schema({ versionKey: false })
export class BanInfoClassForBlog {
    @Prop({
        required: true,
    })
    isBanned: boolean;
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

    async transformToBlogViewModelClass(): Promise<BlogViewModelClass> {
        return new BlogViewModelClass(this.id, this.name, this.description, this.websiteUrl, this.createdAt);
    }
}

export const BlogsSchema = SchemaFactory.createForClass(BlogClass);
BlogsSchema.methods = {
    transformToBlogViewModelClass: BlogClass.prototype.transformToBlogViewModelClass,
};
