import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { QueryDto } from "../../dtos/blogs.dto";
import { PostClass } from "../../schemas/posts.schema";

export class HelperForPosts {
    static async createQuery(dto: ModelForGettingAllPosts, subscribedBlogsIds: string[]): Promise<QueryDto> {
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
            subscriptionStatus = "all",
        } = dto;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;
        if (subscriptionStatus === "all") {
            return { query: {}, skips, sortObj, pageSize, pageNumber };
        }
        const query = { blogId: { $in: subscribedBlogsIds } };
        return { query, skips, sortObj, pageSize, pageNumber };
    }

    static async returnUsersLikeStatusForPosts(userId: string, post: PostClass): Promise<string> {
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

    static async getLikesDataInfoForPost(
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
            post.extendedLikesInfo.myStatus = await HelperForPosts.returnUsersLikeStatusForPosts(userId, post);
        } else {
            post.extendedLikesInfo.myStatus = "None";
        }
        return post;
    }
}
