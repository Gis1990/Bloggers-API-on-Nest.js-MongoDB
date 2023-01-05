import { Injectable } from "@nestjs/common";
import { CommentsQueryRepository } from "../comments.query.repository";
import { CommentsRepository } from "../comments.repository";

@Injectable()
export class LikeOperationForCommentUseCase {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commentsRepository: CommentsRepository,
    ) {}

    async execute(id: string, userId: string, likeStatus: string): Promise<boolean> {
        // Find the comment with the given id
        const comment = await this.commentsQueryRepository.getCommentByIdForLikeOperation(id);
        if (!comment) {
            // Return false if the comment is not found
            return false;
        }

        // Check if the user is liking, disliking, or removing their like/dislike
        const isLike = likeStatus === "Like";
        const isDislike = likeStatus === "Dislike";
        const isNone = likeStatus === "None";

        // Check if the user has already liked or disliked the comment
        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(userId);
        // Declare an update object that will be used to update the comment

        let update: any = {};

        // Update the like/dislike count and user lists based on the likeStatus
        if (isLike && !isLiked && !isDisliked) {
            // Increment the like count and add the user to the list of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
        } else if (isDislike && !isDisliked && !isLiked) {
            // Increment the dislike count and add the user to the list of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        } else if (isLiked && isDislike) {
            // Decrement the like count, increment the dislike count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        } else if (isDisliked && isLike) {
            // Decrement the dislike count, increment the like count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount - 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
        } else if (isLiked && isNone) {
            // Decrement the like count, and update the lists of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
        } else if (isDisliked && isNone) {
            // Decrement the dislike count, and update the lists of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount - 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        }

        return this.commentsRepository.likeOperation(id, update);
    }
}
