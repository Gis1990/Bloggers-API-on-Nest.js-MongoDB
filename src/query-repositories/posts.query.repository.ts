import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "../schemas/posts.schema";
import { BlogClass } from "../schemas/blogs.schema";
import { UserAccountClass } from "../schemas/users.schema";
import { QueryDto } from "../dtos/blogs.dto";
import { GetPostIdDto, PostClassPaginationDto } from "../dtos/posts.dto";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(UserAccountClass.name) private userAccountClass: Model<UserAccountClass>,
    ) {}

    async getAllPosts(queryDtoForPosts: QueryDto): Promise<PostClassPaginationDto> {
        let bannedUsersIdsBySuperAdmin = [];
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        let bannedBlogsIds = [];
        const bannedBlogsInDB = await this.blogsModelClass.find({
            $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
        });
        if (bannedBlogsInDB) {
            bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
        }
        const cursor = await this.postsModelClass
            .find({ blogId: { $nin: bannedBlogsIds } })
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
            bannedUsersIdsBySuperAdmin: bannedUsersIdsBySuperAdmin,
        };
    }

    async getAllPostsForSpecificBlog(queryDtoForPosts: QueryDto, blogId: string): Promise<PostClassPaginationDto> {
        let bannedUsersIdsBySuperAdmin = [];
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        let bannedBlogsIds = [];
        const bannedBlogsInDB = await this.blogsModelClass.find({
            $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
        });
        if (bannedBlogsInDB) {
            bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
        }
        const cursor = await this.postsModelClass
            .find({ $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }] })
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
            bannedUsersIdsBySuperAdmin: bannedUsersIdsBySuperAdmin,
        };
    }

    async getPostById(id: string): Promise<GetPostIdDto | null> {
        let bannedUsersIdsBySuperAdmin = [];
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        const post = await this.postsModelClass.findOne({ id });
        if (!post) return null;
        const blog = await this.blogsModelClass.findOne({ id: post.blogId });
        if (!blog || blog.banInfo.isBanned) return null;
        return { post: post, bannedUsersIdsBySuperAdmin: bannedUsersIdsBySuperAdmin };
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }
}
