import { CommentDBClass, CommentDBClassPagination } from "./entities/comments.entity";
import { CommentsModelClass } from "../../db";
import { ModelForGettingAllComments } from "./dto/comments.dto";

export class CommentsRepository {
    async getCommentById(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({ id: id }, { _id: 0, postId: 0, usersLikesInfo: 0 });
    }

    async getAllCommentsForSpecificPost(
        dto: ModelForGettingAllComments,
        postId: string,
    ): Promise<CommentDBClassPagination> {
        const { PageNumber = 1, PageSize = 10 } = dto;
        const skips = PageSize * (PageNumber - 1);
        const cursor = await CommentsModelClass.find(
            { postId: postId },
            {
                _id: 0,
                postId: 0,
                usersLikesInfo: 0,
            },
        )
            .skip(skips)
            .limit(PageSize)
            .lean();
        const totalCount = await CommentsModelClass.count({ postId: postId });
        return new CommentDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }

    async createComment(comment: CommentDBClass): Promise<CommentDBClass> {
        await CommentsModelClass.insertMany([comment]);
        return comment;
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentsModelClass.updateOne({ id: id }, { $set: { content } });
        return result.matchedCount === 1;
    }

    async likeOperation(id: string, userId: string, likeStatus: string): Promise<boolean> {
        const comment = await CommentsModelClass.findOne({ id: id });
        if (!comment) {
            return false;
        }
        const findUsersLikes = comment.usersLikesInfo.usersWhoPutLike.filter((user) => user === userId);
        const findUsersDislikes = comment.usersLikesInfo.usersWhoPutDislike.filter((user) => user === userId);
        if (findUsersLikes?.length === 0 && likeStatus === "Like" && findUsersDislikes?.length === 0) {
            let likesCount = comment.likesInfo.likesCount;
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                { $set: { "likesInfo.likesCount": likesCount, "likesInfo.myStatus": likeStatus } },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 0 && likeStatus === "Dislike" && findUsersLikes?.length === 0) {
            let dislikesCount = comment.likesInfo.dislikesCount;
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                { $set: { "likesInfo.dislikesCount": dislikesCount, "likesInfo.myStatus": likeStatus } },
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
            let likesCount = comment.likesInfo.likesCount;
            likesCount--;
            let dislikesCount = comment.likesInfo.dislikesCount;
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "likesInfo.likesCount": likesCount,
                        "likesInfo.dislikesCount": dislikesCount,
                        "likesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 1 && likeStatus === "Like") {
            let dislikesCount = comment.likesInfo.dislikesCount;
            dislikesCount--;
            let likesCount = comment.likesInfo.likesCount;
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                {
                    $set: {
                        "likesInfo.likesCount": likesCount,
                        "likesInfo.dislikesCount": dislikesCount,
                        "likesInfo.myStatus": likeStatus,
                    },
                },
            );
            return result.matchedCount === 1;
        }
        if (findUsersLikes?.length === 1 && likeStatus === "None") {
            let likesCount = comment.likesInfo.likesCount;
            likesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                { $set: { "likesInfo.likesCount": likesCount, "likesInfo.myStatus": likeStatus } },
            );
            return result.matchedCount === 1;
        }
        if (findUsersDislikes?.length === 1 && likeStatus === "None") {
            let dislikesCount = comment.likesInfo.dislikesCount;
            dislikesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
            const result = await CommentsModelClass.updateOne(
                { id: id },
                { $set: { "likesInfo.dislikesCount": dislikesCount, "likesInfo.myStatus": likeStatus } },
            );
            return result.matchedCount === 1;
        }
        return true;
    }
    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const comment = await CommentsModelClass.findOne({ id: id });
        const findUsersLikes = comment?.usersLikesInfo.usersWhoPutLike.filter((user) => user === userId);
        const findUsersDislikes = comment?.usersLikesInfo.usersWhoPutDislike.filter((user) => user === userId);
        if (findUsersLikes?.length === 1) {
            return "Like";
        }
        if (findUsersDislikes?.length === 1) {
            return "Dislike";
        }
        return "None";
    }
}
