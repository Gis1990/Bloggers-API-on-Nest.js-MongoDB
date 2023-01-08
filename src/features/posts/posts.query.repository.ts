import { Injectable } from "@nestjs/common";
import { PostDBPaginationClass, PostViewModelClass } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostDBClass, PostDocument } from "./posts.schema";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(PostDBClass.name) private postsModelClass: Model<PostDocument>) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostDBPaginationClass> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const totalCount = await this.postsModelClass.count({});
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await this.postsModelClass.find({}).sort(sortObj).skip(skips).limit(pageSize);
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            const { _id, usersLikesInfo, ...rest } = elem;
            return rest;
        });
        return new PostDBPaginationClass(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }

    async getAllPostsForSpecificBlog(
        dto: ModelForGettingAllPosts,
        blogId: string,
        userId: string | undefined,
    ): Promise<PostDBPaginationClass> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        const totalCount = await this.postsModelClass.count({ blogId: blogId });
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await this.postsModelClass.find({ blogId: blogId }).sort(sortObj).skip(skips).limit(pageSize);
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForPost(userId);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            const { _id, usersLikesInfo, ...rest } = elem.toObject();
            return rest;
        });
        return new PostDBPaginationClass(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }

    async getPostById(id: string, userId: string | undefined): Promise<PostViewModelClass | null> {
        const post = await this.postsModelClass.findOne({ id: id });
        if (!post) {
            return null;
        }
        post.getLikesDataInfoForPost(userId);
        const { _id, usersLikesInfo, ...rest } = post.toObject();
        return rest;
    }

    async getPostByIdForOperationWithLikes(id: string): Promise<PostDBClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }
}
