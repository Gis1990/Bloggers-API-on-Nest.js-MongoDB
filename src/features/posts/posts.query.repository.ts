import { PostsModelClass } from "../../db";
import { Injectable } from "@nestjs/common";
import { PostDBClass, PostDBClassPagination } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";

@Injectable()
export class PostsQueryRepository {
    async getAllPosts(dto: ModelForGettingAllPosts): Promise<PostDBClassPagination> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const totalCount = await PostsModelClass.count({});
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await PostsModelClass.find(
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
        console.log(pageSize);
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        const totalCount = await PostsModelClass.count({ blogId: blogId });
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
            cursor = await PostsModelClass.find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        } else {
            sortObj[sortBy] = 1;
            cursor = await PostsModelClass.find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        }

        return new PostDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async getPostById(id: string): Promise<PostDBClass | null> {
        return PostsModelClass.findOne({ id: id }, { _id: 0, usersLikesInfo: 0 });
    }

    async getPostByIdForLikeOperation(id: string): Promise<PostDBClass | null> {
        return PostsModelClass.findOne({ id: id });
    }

    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const post = await PostsModelClass.findOne({ id: id });
        if (post?.usersLikesInfo.usersWhoPutLike.includes(userId)) {
            return "Like";
        } else if (post?.usersLikesInfo.usersWhoPutDislike.includes(userId)) {
            return "Dislike";
        } else {
            return "None";
        }
    }
}
