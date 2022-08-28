import { NewestLikesClass, PostDBClass, PostDBClassPagination } from "../entity/types";
import { PostsModelClass } from "../entity/db";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostsRepository {
    async getAllPosts(PageNumber: number, PageSize: number): Promise<PostDBClassPagination> {
        const skips = PageSize * (PageNumber - 1);
        const cursor = await PostsModelClass.find({}, { _id: 0, usersLikesInfo: 0 }).skip(skips).limit(PageSize).lean();
        const totalCount = await PostsModelClass.count({});
        return new PostDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }
    async getAllPostsForSpecificBlogger(
        PageNumber: number,
        PageSize: number,
        bloggerId: string,
    ): Promise<PostDBClassPagination> {
        const skips = PageSize * (PageNumber - 1);
        const cursor = await PostsModelClass.find({ bloggerId: bloggerId }, { _id: 0, usersLikesInfo: 0 })
            .skip(skips)
            .limit(PageSize)
            .lean();
        const totalCount = await PostsModelClass.count({ bloggerId: bloggerId });
        return new PostDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }
    async getPostById(id: string): Promise<PostDBClass | null> {
        return PostsModelClass.findOne({ id: id }, { _id: 0, usersLikesInfo: 0 });
    }
    async createPost(post: PostDBClass): Promise<PostDBClass> {
        await PostsModelClass.insertMany([post]);
        return post;
    }
    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: string,
    ): Promise<boolean> {
        const post = await PostsModelClass.findOne({ id: id });
        let bloggerName;
        if (post) {
            bloggerName = post.bloggerName;
        }
        const result = await PostsModelClass.updateOne(
            { id: id },
            { $set: { title, shortDescription, content, bloggerId, bloggerName } },
        );
        return result.matchedCount === 1;
    }
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
    async likeOperation(id: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        const post = await PostsModelClass.findOne({ id: id });
        if (!post) {
            return false;
        }
        const findUsersLikes = post.usersLikesInfo.usersWhoPutLike.filter((user) => user === userId);
        const findUsersDislikes = post.usersLikesInfo.usersWhoPutDislike.filter((user) => user === userId);
        if (findUsersLikes?.length === 0 && likeStatus === "Like" && findUsersDislikes?.length === 0) {
            const newLikes: NewestLikesClass = new NewestLikesClass(new Date(), userId, login);
            let newLikesCount = post.extendedLikesInfo.likesCount;
            newLikesCount++;
            await PostsModelClass.updateOne(
                { id: id },
                { $set: { "extendedLikesInfo.likesCount": newLikesCount, "extendedLikesInfo.myStatus": likeStatus } },
            );
            const result = await PostsModelClass.updateOne(
                { id: id },
                { $push: { "extendedLikesInfo.newestLikes": newLikes, "usersLikesInfo.usersWhoPutLike": userId } },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 0 && likeStatus === "Dislike" && findUsersLikes?.length === 0) {
            let newDislikesCount = post.extendedLikesInfo.dislikesCount;
            newDislikesCount++;
            await PostsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await PostsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "extendedLikesInfo.dislikesCount": newDislikesCount,
                        "extendedLikesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        if (findUsersLikes?.length === 1 && likeStatus === "Like") {
            return true;
        }
        if (findUsersDislikes?.length === 1 && likeStatus === "Dislike") {
            return true;
        }
        if (findUsersLikes?.length === 1 && likeStatus === "Dislike") {
            let newLikesCount = post.extendedLikesInfo.likesCount;
            newLikesCount--;
            let newDislikesCount = post.extendedLikesInfo.dislikesCount;
            newDislikesCount++;
            await PostsModelClass.updateOne(
                { id: id },
                {
                    $pull: {
                        "usersLikesInfo.usersWhoPutLike": userId,
                        "extendedLikesInfo.newestLikes": { userId: userId },
                    },
                },
            );
            await PostsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await PostsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "extendedLikesInfo.likesCount": newLikesCount,
                        "extendedLikesInfo.dislikesCount": newDislikesCount,
                        "extendedLikesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 1 && likeStatus === "Like") {
            const newLikes: NewestLikesClass = new NewestLikesClass(new Date(), userId, login);
            let newDislikesCount = post?.extendedLikesInfo.dislikesCount;
            newDislikesCount--;
            let newLikesCount = post.extendedLikesInfo.likesCount;
            newLikesCount++;
            await PostsModelClass.updateOne(
                { id: id },
                { $push: { "extendedLikesInfo.newestLikes": newLikes, "usersLikesInfo.usersWhoPutLike": userId } },
            );
            const result = await PostsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "extendedLikesInfo.likesCount": newLikesCount,
                        "extendedLikesInfo.dislikesCount": newDislikesCount,
                        "extendedLikesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        if (findUsersLikes?.length === 1 && likeStatus === "None") {
            let newLikesCount = post.extendedLikesInfo.likesCount;
            newLikesCount--;
            await PostsModelClass.updateOne(
                { id: id },
                {
                    $pull: {
                        "usersLikesInfo.usersWhoPutLike": userId,
                        "extendedLikesInfo.newestLikes": { userId: userId },
                    },
                },
            );
            const result = await PostsModelClass.updateOne(
                { id: id },
                { $set: { "extendedLikesInfo.likesCount": newLikesCount, "extendedLikesInfo.myStatus": likeStatus } },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 1 && likeStatus === "None") {
            let newDislikesCount = post?.extendedLikesInfo.dislikesCount;
            newDislikesCount--;
            await PostsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await PostsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "extendedLikesInfo.dislikesCount": newDislikesCount,
                        "extendedLikesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        return true;
    }
    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const post = await PostsModelClass.findOne({ id: id });
        const findUsersLikes = post?.usersLikesInfo.usersWhoPutLike.filter((user) => user === userId);
        const findUsersDislikes = post?.usersLikesInfo.usersWhoPutDislike.filter((user) => user === userId);
        if (findUsersLikes?.length === 1) {
            return "Like";
        }
        if (findUsersDislikes?.length === 1) {
            return "Dislike";
        }
        return "None";
    }
}
