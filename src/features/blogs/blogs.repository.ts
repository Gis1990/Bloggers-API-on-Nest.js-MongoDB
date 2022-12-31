import { Injectable } from "@nestjs/common";
import { BlogResponseModelClass } from "./entities/blogs.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BlogDBClass, BlogDocument } from "./blogs.schema";
import { CreatedBlogDto, InputModelForUpdatingBlog } from "./dto/blogs.dto";

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(BlogDBClass.name) private blogsModelClass: Model<BlogDocument>) {}

    async createBlog(newBlog: CreatedBlogDto): Promise<BlogResponseModelClass> {
        const blog = new this.blogsModelClass(newBlog);
        await blog.save();
        const { _id, ...blogRest } = blog.toObject();
        return blogRest;
    }

    async updateBlog(blogId: string, dto: InputModelForUpdatingBlog): Promise<boolean> {
        const name = dto.name;
        const description = dto.description;
        const websiteUrl = dto.websiteUrl;
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { $set: { name, description, websiteUrl } },
        );
        return result.matchedCount === 1;
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await this.blogsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
