import { CommentClass } from "../comments.schema";

export async function returnUsersLikeStatusForComments(userId: string, comment: CommentClass): Promise<string> {
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

export async function getLikesDataInfoForComment(
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
        comment.likesInfo.myStatus = await returnUsersLikeStatusForComments(userId, comment);
    } else {
        comment.likesInfo.myStatus = "None";
    }
    return comment;
}
