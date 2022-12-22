import { CommentDBClass, CommentDBClassPagination } from "./entities/comments.entity";
import { CommentsModelClass } from "../../db";
import { ModelForGettingAllComments } from "./dto/comments.dto";

export class CommentsQueryRepository {
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

    async getCommentByIdForLikeOperation(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({ id: id });
    }

    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const comment = await CommentsModelClass.findOne({ id: id });

        const isLiked = comment?.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment?.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }
}
