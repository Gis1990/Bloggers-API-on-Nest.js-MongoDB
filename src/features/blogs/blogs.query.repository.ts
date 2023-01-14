import { Injectable } from "@nestjs/common";
import { BlogClassPagination, BlogViewModelClass } from "./entities/blogs.entity";
import { ModelForGettingAllBlogs } from "./dto/blogs.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogClass } from "./blogs.schema";
import { createQueryForBlogs } from "./helpers/blogs.query.repository.helpers";

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>) {}

    async getAllBlogs(dto: ModelForGettingAllBlogs): Promise<BlogClassPagination> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find({ $and: [result.query, { "banInfo.isBanned": false }] }, { _id: 0, blogOwnerInfo: 0, banInfo: 0 })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count({
            $and: [result.query, { "banInfo.isBanned": false }, { "banInfo.isBanned": false }],
        });
        return new BlogClassPagination(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getAllBlogsForAuthorizedUser(dto: ModelForGettingAllBlogs, userId: string): Promise<BlogClassPagination> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find(
                { $and: [result.query, { "blogOwnerInfo.userId": userId }, { "banInfo.isBanned": false }] },
                { _id: 0, blogOwnerInfo: 0, banInfo: 0 },
            )
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count({
            $and: [result.query, { "blogOwnerInfo.userId": userId }, { "banInfo.isBanned": false }],
        });
        return new BlogClassPagination(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getAllBlogsForSuperAdmin(dto: ModelForGettingAllBlogs): Promise<BlogClassPagination> {
        const result = await createQueryForBlogs(dto);
        const cursor = await this.blogsModelClass
            .find(result.query, { _id: 0 })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.blogsModelClass.count(result.query);
        return new BlogClassPagination(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            cursor,
        );
    }

    async getBlogById(id: string): Promise<BlogClass | null> {
        console.log(await this.blogsModelClass.findOne({ id: id }));
        return this.blogsModelClass.findOne({ id: id });
    }

    async getBlogByIdWithCorrectViewModel(id: string): Promise<BlogViewModelClass | null> {
        return this.blogsModelClass.findOne({ id: id }, { _id: 0, blogOwnerInfo: 0 });
    }
}
