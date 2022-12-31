import { Injectable } from "@nestjs/common";
import { PostDBClassPagination } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostDBClass, PostDocument } from "./posts.schema";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(PostDBClass.name) private postsModelClass: Model<PostDocument>) {}

    async getAllPosts(dto: ModelForGettingAllPosts): Promise<PostDBClassPagination> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const totalCount = await this.postsModelClass.count({});
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await this.postsModelClass
            .find(
                {},
                {
                    _id: 0,
                    usersLikesInfo: 0,
                },
            )
            .sort(sortObj)
            .skip(skips)
            .limit(pageSize)
            .lean();
        return new PostDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async getAllPostsForSpecificBlog(dto: ModelForGettingAllPosts, blogId: string): Promise<PostDBClassPagination> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        let cursor;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        const totalCount = await this.postsModelClass.count({ blogId: blogId });
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
            cursor = await this.postsModelClass
                .find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        } else {
            sortObj[sortBy] = 1;
            cursor = await this.postsModelClass
                .find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        }

        return new PostDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async getPostById(id: string): Promise<PostDBClass | null> {
        return this.postsModelClass.findOne({ id: id }, { _id: 0, usersLikesInfo: 0 });
    }

    async getPostByIdForLikeOperation(id: string): Promise<PostDBClass | null> {
        return this.postsModelClass.findOne({ id: id });
    }

    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const post = await this.postsModelClass.findOne({ id: id });
        if (post?.usersLikesInfo.usersWhoPutLike.includes(userId)) {
            return "Like";
        } else if (post?.usersLikesInfo.usersWhoPutDislike.includes(userId)) {
            return "Dislike";
        } else {
            return "None";
        }
    }
}
