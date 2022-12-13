import { Injectable } from "@nestjs/common";
import { BlogsModelClass } from "../../db";
import { BlogClassResponseModel, BlogDBClass, BlogDBClassPagination } from "./entities/blogs.entity";
import { InputModelForUpdatingBlog, InputModelForCreatingBlog, ModelForGettingAllBlogs } from "./dto/blogs.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class BlogsRepository {
    async getAllBlogs(dto: ModelForGettingAllBlogs) {
        const {
            searchNameTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        const skips = pageSize * (pageNumber - 1);
        let cursor;
        let totalCount;
        const sortObj: any = {};
        if (searchNameTerm) {
            if (sortDirection === "desc") {
                sortObj[sortBy] = -1;
                cursor = await BlogsModelClass.find(
                    {
                        name: {
                            $regex: searchNameTerm,
                            $options: "i",
                        },
                    },
                    { _id: 0 },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await BlogsModelClass.count({ name: { $regex: searchNameTerm, $options: "i" } });
            } else {
                sortObj[sortBy] = 1;
                cursor = await BlogsModelClass.find(
                    {
                        name: {
                            $regex: searchNameTerm,
                            $options: "i",
                        },
                    },
                    { _id: 0 },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await BlogsModelClass.count({ name: { $regex: searchNameTerm, $options: "i" } });
            }
        } else {
            if (sortDirection === "desc") {
                sortObj[sortBy] = -1;
                cursor = await BlogsModelClass.find({}, { _id: 0 }).sort(sortObj).skip(skips).limit(pageSize).lean();
                totalCount = await BlogsModelClass.count({});
            } else {
                sortObj[sortBy] = 1;
                cursor = await BlogsModelClass.find({}, { _id: 0 }).sort(sortObj).skip(skips).limit(pageSize).lean();
                totalCount = await BlogsModelClass.count({});
            }
        }
        return new BlogDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async getBlogById(id: string): Promise<BlogDBClass | null> {
        return BlogsModelClass.findOne({ id: id }, { _id: 0 });
    }

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

    async updateBlog(dto: InputModelForUpdatingBlog): Promise<boolean> {
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
