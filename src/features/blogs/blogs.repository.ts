import { Injectable } from "@nestjs/common";
import { BlogsModelClass } from "../../db";
import { BlogClassResponseModel, BlogDBClass, BlogDBClassPagination } from "./entities/blogs.entity";
import {
    InputModelForUpdatingBlog,
    InputModelForCreatingBlog,
    ModelForGettingAllBlogs,
} from "./dto/blogs.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class BlogsRepository {
    async getAllBlogs(dto: ModelForGettingAllBlogs) {
        const { SearchNameTerm = null, PageNumber = 1, PageSize = 10 } = dto;
        const skips = PageSize * (PageNumber - 1);
        let cursor;
        let totalCount;
        if (SearchNameTerm) {
            cursor = await BlogsModelClass.find({ name: { $regex: SearchNameTerm } }, { _id: 0 })
                .skip(skips)
                .limit(PageSize)
                .lean();
            totalCount = await BlogsModelClass.count({
                name: { $regex: SearchNameTerm },
            });
        } else {
            cursor = await BlogsModelClass.find({}, { _id: 0 }).skip(skips).limit(PageSize).lean();
            totalCount = await BlogsModelClass.count({});
        }
        return new BlogDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }
    async getBlogById(id: string): Promise<BlogDBClass | null> {
        return BlogsModelClass.findOne({ id: id }, { _id: 0 });
    }
    async createBlog(dto: InputModelForCreatingBlog): Promise<BlogClassResponseModel> {
        const blog: BlogDBClass = new BlogDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.name,
            dto.youtubeUrl,
        );
        await BlogsModelClass.insertMany([blog]);
        const { _id, ...newBlogRest } = blog;
        return newBlogRest;
    }
    async updateBlog(dto: InputModelForUpdatingBlog): Promise<boolean> {
        const name = dto.name;
        const youtubeUrl = dto.youtubeUrl;
        const result = await BlogsModelClass.updateOne({ id: dto.id }, { $set: { name, youtubeUrl } });
        return result.matchedCount === 1;
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
