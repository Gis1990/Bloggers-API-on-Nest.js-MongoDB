import { Injectable } from "@nestjs/common";
import { BloggersModelClass } from "../../db";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./entities/bloggers.entity";
import {
    InputModelForUpdatingBlogger,
    InputModelForCreatingBlogger,
    ModelForGettingAllBloggers,
} from "./dto/bloggers.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class BloggersRepository {
    async getAllBloggers(dto: ModelForGettingAllBloggers) {
        const { SearchNameTerm = null, PageNumber = 1, PageSize = 10 } = dto;
        const skips = PageSize * (PageNumber - 1);
        let cursor;
        let totalCount;
        if (SearchNameTerm) {
            cursor = await BloggersModelClass.find({ name: { $regex: SearchNameTerm } }, { _id: 0 })
                .skip(skips)
                .limit(PageSize)
                .lean();
            totalCount = await BloggersModelClass.count({
                name: { $regex: SearchNameTerm },
            });
        } else {
            cursor = await BloggersModelClass.find({}, { _id: 0 }).skip(skips).limit(PageSize).lean();
            totalCount = await BloggersModelClass.count({});
        }
        return new BloggerDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }
    async getBloggerById(id: string): Promise<BloggerDBClass | null> {
        return BloggersModelClass.findOne({ id: id }, { _id: 0 });
    }
    async createBlogger(dto: InputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        const blogger: BloggerDBClass = new BloggerDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.name,
            dto.youtubeUrl,
        );
        await BloggersModelClass.insertMany([blogger]);
        const { _id, ...newBloggerRest } = blogger;
        return newBloggerRest;
    }
    async updateBlogger(dto: InputModelForUpdatingBlogger): Promise<boolean> {
        const name = dto.name;
        const youtubeUrl = dto.youtubeUrl;
        const result = await BloggersModelClass.updateOne({ id: dto.id }, { $set: { name, youtubeUrl } });
        return result.matchedCount === 1;
    }
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await BloggersModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
