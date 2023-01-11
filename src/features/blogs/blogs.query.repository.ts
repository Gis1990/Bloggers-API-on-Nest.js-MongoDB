import { Injectable } from "@nestjs/common";
import { BlogDBPaginationClass, BlogViewModelClass } from "./entities/blogs.entity";
import { ModelForGettingAllBlogs } from "./dto/blogs.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogClass } from "./blogs.schema";
import { createQueryForBlogs } from "./helpers/blogs.query.repository.helpers";

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>) {}

    async getAllBlogs(dto: ModelForGettingAllBlogs): Promise<BlogDBPaginationClass> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find(result.query, { _id: 0, blogOwnerInfo: 0 })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count(result.query);
        return new BlogDBPaginationClass(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getAllBlogsForAuthorizedUser(dto: ModelForGettingAllBlogs, userId: string): Promise<BlogDBPaginationClass> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find({ $and: [result.query, { userId: userId }] }, { _id: 0, blogOwnerInfo: 0 })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count(result.query);
        return new BlogDBPaginationClass(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getAllBlogsWithAdditionalInfo(dto: ModelForGettingAllBlogs): Promise<BlogDBPaginationClass> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find(result.query, { _id: 0 })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count(result.query);
        return new BlogDBPaginationClass(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getBlogById(id: string): Promise<BlogClass | null> {
        return this.blogsModelClass.findOne({ id: id });
    }

    async getBlogByIdWithCorrectViewModel(id: string): Promise<BlogViewModelClass | null> {
        return this.blogsModelClass.findOne({ id: id }, { _id: 0, blogOwnerInfo: 0 });
    }
}
