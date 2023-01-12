import { Injectable } from "@nestjs/common";
import { PostDBPaginationClass, PostViewModelClass } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostClass } from "./posts.schema";
import { BannedUsersClass } from "../users/users.schema";
import { createQueryForPosts } from "./helpers/posts.query.repository.helpers";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(BannedUsersClass.name) private bannedUserListClass: Model<BannedUsersClass>,
    ) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostDBPaginationClass> {
        const result = await createQueryForPosts(dto);
        const cursor = await this.postsModelClass
            .find({})
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        const totalCount = await this.postsModelClass.count({});
        let bannedUsers;
        const bannedUsersInDB = await this.bannedUserListClass.find({});
        if (!bannedUsersInDB) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsers;
        }
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsers);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToPostViewModelClass();
        });
        return new PostDBPaginationClass(
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
    ): Promise<PostDBPaginationClass> {
        const result = await createQueryForPosts(dto);
        const cursor = await this.postsModelClass
            .find({ blogId: blogId })
            .sort(result.sortObj)
            .skip(result.skips)
            .limit(result.pageSize);
        let bannedUsers;
        const bannedUsersInDB = await this.bannedUserListClass.find({});
        if (!bannedUsersInDB) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsers;
        }
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId, bannedUsers);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToPostViewModelClass();
        });
        const totalCount = await this.postsModelClass.count({ blogId: blogId });
        return new PostDBPaginationClass(
            Math.ceil(totalCount / result.pageSize),
            result.pageNumber,
            result.pageSize,
            totalCount,
            await Promise.all(cursorWithCorrectViewModel),
        );
    }

    async getPostById(id: string, userId: string | undefined): Promise<PostViewModelClass | null> {
        let bannedUsers;
        const bannedUsersInDB = await this.bannedUserListClass.find({});
        if (!bannedUsersInDB) {
            bannedUsers = [];
        } else {
            bannedUsers = (await this.bannedUserListClass.find({}))[0].bannedUsers;
        }
        const post = await this.postsModelClass.findOne({ id: id });
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
