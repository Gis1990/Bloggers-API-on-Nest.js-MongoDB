import { QueryDto } from "../../dtos/blogs.dto";
import { ModelForGettingAllComments } from "../../dtos/comments.dto";
import { CommentClass } from "../../schemas/comments.schema";

export class HelperForComments {
    static async createQuery(dto: ModelForGettingAllComments): Promise<QueryDto> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;
        const query: any = {};
        return { query, skips, sortObj, pageSize, pageNumber };
    }

    static async returnUsersLikeStatusForComments(userId: string, comment: CommentClass): Promise<string> {
        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }

    static async getLikesDataInfoForComment(
        userId: string | undefined,
        bannedUsers: string[],
        comment: CommentClass,
    ): Promise<CommentClass> {
        if (bannedUsers.length > 0) {
            comment.likesInfo.likesCount = comment.usersLikesInfo.usersWhoPutLike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
            comment.likesInfo.dislikesCount = comment.usersLikesInfo.usersWhoPutDislike.filter(
                (elem) => !bannedUsers.includes(elem),
            ).length;
        }
        if (userId) {
            comment.likesInfo.myStatus = await HelperForComments.returnUsersLikeStatusForComments(userId, comment);
        } else {
            comment.likesInfo.myStatus = "None";
        }
        return comment;
    }
}
