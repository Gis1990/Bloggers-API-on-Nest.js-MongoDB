import { Injectable } from "@nestjs/common";
import { PostClassPagination, PostViewModelClass } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "./posts.schema";
import { createQueryForPosts } from "./helpers/posts.query.repository.helpers";
import { BlogClass } from "../blogs/blogs.schema";
import { UserAccountClass } from "../super-admin/users/users.schema";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(UserAccountClass.name) private userAccountClass: Model<UserAccountClass>,
    ) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostClassPagination> {
        const result = await createQueryForPosts(dto);
        let bannedBlogsIds;
        let bannedUsersIdsBySuperAdmin;
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (!bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = [];
        } else {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        const bannedBlogsInDB = await this.blogsModelClass.find({
            $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
        });
        if (!bannedBlogsInDB) {
            bannedBlogsIds = [];
        } else {
            bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
        }
        const cursor = await this.postsModelClass
            .find({ blogId: { $nin: bannedBlogsIds } })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.postsModelClass.count({ blogId: { $nin: bannedBlogsIds } });
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToPostViewModelClass();
        });
        return new PostClassPagination(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            await Promise.all(cursorWithCorrectViewModel),
        );
    }

    async getAllPostsForSpecificBlog(
        dto: ModelForGettingAllPosts,
        blogId: string,
        userId: string | undefined,
    ): Promise<PostClassPagination> {
        const result = await createQueryForPosts(dto);
        let bannedBlogsIds;
        let bannedUsersIdsBySuperAdmin;
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (!bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = [];
        } else {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        const bannedBlogsInDB = await this.blogsModelClass.find({
            $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
        });
        if (!bannedBlogsInDB) {
            bannedBlogsIds = [];
        } else {
            bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
        }
        const cursor = await this.postsModelClass
            .find({ $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }] })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.postsModelClass.count({
            $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }],
        });
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToPostViewModelClass();
        });
        return new PostClassPagination(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            await Promise.all(cursorWithCorrectViewModel),
        );
    }

    async getPostById(id: string, userId: string | undefined): Promise<PostViewModelClass | null> {
        let bannedUsersIdsBySuperAdmin;
        const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        if (!bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = [];
        } else {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        const post = await this.postsModelClass.findOne({ id });
        if (!post) return null;
        const blog = await this.blogsModelClass.findOne({ id: post.blogId });
        if (!blog || blog.banInfo.isBanned) return null;
        post.getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin);
        return post.transformToPostViewModelClass();
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }
}
