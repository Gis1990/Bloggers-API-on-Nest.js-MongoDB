import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "../schemas/posts.schema";
import { QueryDto } from "../dtos/blogs.dto";
import { PostClassPaginationDto } from "../dtos/posts.dto";
import { BlogViewModelClass } from "../entities/blogs.entity";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(PostClass.name) private postsModelClass: Model<PostClass>) {}

    async getAllPosts(queryDtoForPosts: QueryDto, bannedBlogsIds: string[]): Promise<PostClassPaginationDto> {
        const cursor = await this.postsModelClass
            .find({ $and: [queryDtoForPosts.query, { blogId: { $nin: bannedBlogsIds } }] }, { _id: 0 })
            .sort(queryDtoForPosts.sortObj)
            .skip(queryDtoForPosts.skips)
            .limit(queryDtoForPosts.pageSize);
        const totalCount = await this.postsModelClass.count({ blogId: { $nin: bannedBlogsIds } });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForPosts.pageSize),
            page: queryDtoForPosts.pageNumber,
            pageSize: queryDtoForPosts.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllPostsForSpecificBlog(
        queryDtoForPosts: QueryDto,
        bannedBlogsIds: string[],
        blogId: string,
    ): Promise<PostClassPaginationDto> {
        const cursor = await this.postsModelClass
            .find(
                { $and: [queryDtoForPosts.query, { blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }] },
                { _id: 0 },
            )
            .sort(queryDtoForPosts.sortObj)
            .skip(queryDtoForPosts.skips)
            .limit(queryDtoForPosts.pageSize);
        const totalCount = await this.postsModelClass.count({
            $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }],
        });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForPosts.pageSize),
            page: queryDtoForPosts.pageNumber,
            pageSize: queryDtoForPosts.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getPostById(id: string, bannedUsersIdsBySuperAdmin: string[]): Promise<PostClass | null> {
        const post = await this.postsModelClass.findOne({
            $and: [{ id: id }, { postOwnerId: { $nin: bannedUsersIdsBySuperAdmin } }],
        });
        if (!post) return null;
        return post;
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }

    async getDataAboutImages(id: string): Promise<BlogViewModelClass | null> {
        return this.postsModelClass.findOne(
            { id: id },
            {
                _id: 0,
                images: 1,
            },
        );
    }
}
