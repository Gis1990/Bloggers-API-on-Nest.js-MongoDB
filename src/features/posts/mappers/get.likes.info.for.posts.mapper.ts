import { PostClass } from "../posts.schema";

export async function returnUsersLikeStatusForPosts(userId: string, post: PostClass): Promise<string> {
    const isLiked = post.usersLikesInfo.usersWhoPutLike.includes(userId);
    const isDisliked = post.usersLikesInfo.usersWhoPutDislike.includes(userId);

    if (isLiked) {
        return "Like";
    }

    if (isDisliked) {
        return "Dislike";
    }

    return "None";
}

export async function getLikesDataInfoForPost(
    userId: string | undefined,
    bannedUsers: string[],
    post: PostClass,
): Promise<PostClass> {
    if (bannedUsers.length > 0) {
        const likesWithoutBannedUsers = post.extendedLikesInfo.newestLikes.filter(
            (elem) => !bannedUsers.includes(elem.userId),
        );
        post.extendedLikesInfo.newestLikes = likesWithoutBannedUsers
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        post.extendedLikesInfo.likesCount = post.usersLikesInfo.usersWhoPutLike.filter(
            (elem) => !bannedUsers.includes(elem),
        ).length;
        post.extendedLikesInfo.dislikesCount = post.usersLikesInfo.usersWhoPutDislike.filter(
            (elem) => !bannedUsers.includes(elem),
        ).length;
    }
    if (userId) {
        post.extendedLikesInfo.myStatus = await returnUsersLikeStatusForPosts(userId, post);
    } else {
        post.extendedLikesInfo.myStatus = "None";
    }
    return post;
}
