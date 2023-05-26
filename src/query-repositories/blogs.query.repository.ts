import { Injectable } from "@nestjs/common";
import { BlogViewModelClass } from "../entities/blogs.entity";
import { BlogClassPaginationDto, QueryDto } from "../dtos/blogs.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogClass } from "../schemas/blogs.schema";

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>) {}

    async getAllBlogs(queryDtoForBlogs: QueryDto): Promise<BlogClassPaginationDto> {
        const cursor = await this.blogsModelClass
            .find(
                { $and: [queryDtoForBlogs.query, { "banInfo.isBanned": false }] },
                { _id: 0, blogOwnerInfo: 0, banInfo: 0 },
            )
            .sort(queryDtoForBlogs.sortObj)
            .skip(queryDtoForBlogs.skips)
            .limit(queryDtoForBlogs.pageSize);
        const totalCount = await this.blogsModelClass.count({
            $and: [queryDtoForBlogs.query, { "banInfo.isBanned": false }],
        });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForBlogs.pageSize),
            page: queryDtoForBlogs.pageNumber,
            pageSize: queryDtoForBlogs.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllBlogsForAuthorizedUser(queryDtoForBlogs: QueryDto, userId: string): Promise<BlogClassPaginationDto> {
        const cursor = await this.blogsModelClass
            .find(
                { $and: [queryDtoForBlogs.query, { "blogOwnerInfo.userId": userId }, { "banInfo.isBanned": false }] },
                { _id: 0, blogOwnerInfo: 0, banInfo: 0 },
            )
            .sort(queryDtoForBlogs.sortObj)
            .skip(queryDtoForBlogs.skips)
            .limit(queryDtoForBlogs.pageSize);
        const totalCount = await this.blogsModelClass.count({
            $and: [queryDtoForBlogs.query, { "blogOwnerInfo.userId": userId }, { "banInfo.isBanned": false }],
        });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForBlogs.pageSize),
            page: queryDtoForBlogs.pageNumber,
            pageSize: queryDtoForBlogs.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllBlogsForSuperAdmin(queryDtoForBlogs: QueryDto): Promise<BlogClassPaginationDto> {
        const cursor = await this.blogsModelClass
            .find(queryDtoForBlogs.query, { _id: 0, images: 0 })
            .sort(queryDtoForBlogs.sortObj)
            .skip(queryDtoForBlogs.skips)
            .limit(queryDtoForBlogs.pageSize);
        const totalCount = await this.blogsModelClass.count(queryDtoForBlogs.query);
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForBlogs.pageSize),
            page: queryDtoForBlogs.pageNumber,
            pageSize: queryDtoForBlogs.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllBannedBlogs(bannedUsersIdsBySuperAdmin: string[]): Promise<BlogClass[]> {
        return this.blogsModelClass.find({
            $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
        });
    }

    async getBlogById(id: string): Promise<BlogClass | null> {
        return this.blogsModelClass.findOne({ $and: [{ id: id }, { "banInfo.isBanned": false }] });
    }

    async getBlogByIdForBanUnbanOperation(id: string): Promise<BlogClass | null> {
        return this.blogsModelClass.findOne({ id: id });
    }

    async getBlogByIdWithCorrectViewModel(id: string): Promise<BlogViewModelClass | null> {
        return this.blogsModelClass.findOne(
            { id: id },
            {
                _id: 0,
                blogOwnerInfo: 0,
                banInfo: 0,
            },
        );
    }

    async getDataAboutImages(id: string): Promise<BlogViewModelClass | null> {
        return this.blogsModelClass.findOne(
            { id: id },
            {
                _id: 0,
                images: 1,
            },
        );
    }
}
