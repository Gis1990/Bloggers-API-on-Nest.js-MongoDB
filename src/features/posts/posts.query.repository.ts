import { Injectable } from "@nestjs/common";
import { PostClassPagination, PostViewModelClass } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "./posts.schema";
import { BlogClass } from "../blogs/blogs.schema";
import { UserAccountClass } from "../super-admin/users/users.schema";
import {
    createQuery,
    getBannedBlogsIds,
    getBannedUsersIdsBySuperAdmin,
} from "../../helpers/helpers.for.query.repositories";
import { getLikesDataInfoForPost } from "./mappers/get.likes.info.for.posts.mapper";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(UserAccountClass.name) private userAccountClass: Model<UserAccountClass>,
    ) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostClassPagination> {
        const result = await createQuery(dto);
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        const bannedBlogsIds = await getBannedBlogsIds(bannedUsersIdsBySuperAdmin);
        const cursor = await this.postsModelClass
            .find({ blogId: { $nin: bannedBlogsIds } })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.postsModelClass.count({ blogId: { $nin: bannedBlogsIds } });
        cursor.forEach((elem) => {
            getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin, elem);
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
        const result = await createQuery(dto);
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        const bannedBlogsIds = await getBannedBlogsIds(bannedUsersIdsBySuperAdmin);
        const cursor = await this.postsModelClass
            .find({ $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }] })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.postsModelClass.count({
            $and: [{ blogId: blogId }, { blogId: { $nin: bannedBlogsIds } }],
        });
        cursor.forEach((elem) => {
            getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin, elem);
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
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        const post = await this.postsModelClass.findOne({ id });
        if (!post) return null;
        const blog = await this.blogsModelClass.findOne({ id: post.blogId });
        if (!blog || blog.banInfo.isBanned) return null;
        const correctPost = await getLikesDataInfoForPost(userId, bannedUsersIdsBySuperAdmin, post);
        return correctPost.transformToPostViewModelClass();
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }
}
