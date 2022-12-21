import { Injectable } from "@nestjs/common";
import { BlogsModelClass } from "../../db";
import { BlogClassResponseModel, BlogDBClass, ModelForUpdatingBlog } from "./entities/blogs.entity";
import { InputModelForCreatingBlog } from "./dto/blogs.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class BlogsRepository {
    async createBlog(dto: InputModelForCreatingBlog): Promise<BlogClassResponseModel> {
        const blog: BlogDBClass = new BlogDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.name,
            dto.description,
            dto.websiteUrl,
            new Date(),
        );
        await BlogsModelClass.insertMany([blog]);
        const { _id, ...newBlogRest } = blog;
        return newBlogRest;
    }

    async updateBlog(dto: ModelForUpdatingBlog): Promise<boolean> {
        const name = dto.name;
        const description = dto.description;
        const websiteUrl = dto.websiteUrl;
        const result = await BlogsModelClass.updateOne({ id: dto.id }, { $set: { name, description, websiteUrl } });
        return result.matchedCount === 1;
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
