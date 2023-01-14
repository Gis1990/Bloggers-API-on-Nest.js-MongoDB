import { Injectable } from "@nestjs/common";
import { PostClassPagination, PostViewModelClass } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "./posts.schema";
import { BannedUsersAndBlogsClass } from "../super-admin/users/users.schema";
import { createQueryForPosts } from "./helpers/posts.query.repository.helpers";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(BannedUsersAndBlogsClass.name) private bannedUserListClass: Model<BannedUsersAndBlogsClass>,
    ) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostClassPagination> {
        const result = await createQueryForPosts(dto);
        let bannedUsers;
        const bannedUsersInDB = await this.bannedUserListClass.find({});
        if (!bannedUsersInDB) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsersBySuperAdmin;
        }
        const cursor = await this.postsModelClass
            .find({})
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        cursor.filter((elem) => !bannedUsersInDB[0].bannedBlogsBySuperAdmin.includes(elem.blogId));
        const totalCount = await this.postsModelClass.count({});
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsers);
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
        let bannedUsers;
        const bannedUsersAndBlogsInDb = await this.bannedUserListClass.find({});
        if (!bannedUsersAndBlogsInDb) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsersBySuperAdmin;
        }
        const cursor = await this.postsModelClass
            .find({ blogId: { $nin: bannedUsersAndBlogsInDb[0].bannedBlogsBySuperAdmin } })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsers);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToPostViewModelClass();
        });
        const totalCount = await this.postsModelClass.count({
            blogId: {
                $nin: bannedUsersAndBlogsInDb[0].bannedBlogsBySuperAdmin,
            },
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
        let bannedUsers;
        const bannedUsersAndBlogsInDb = await this.bannedUserListClass.find({});
        if (!bannedUsersAndBlogsInDb[0].bannedUsersBySuperAdmin) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsersBySuperAdmin;
        }
        const post = await this.postsModelClass.findOne({
            $and: [{ id: id }, { blogId: { $nin: bannedUsersAndBlogsInDb[0].bannedBlogsBySuperAdmin } }],
        });
        if (!post) {
            return null;
        }
        post.getLikesDataInfoForPost(userId, bannedUsers);
        return post.transformToPostViewModelClass();
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }
}
