import { CommentsRepository } from "../../repositories/comments.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetCommentByIdForLikeOperationCommand } from "../../queries/comments/get-comment-by-id-for-like-operation-query";

export class LikeOperationForCommentCommand {
    constructor(public readonly id: string, public readonly userId: string, public readonly likeStatus: string) {}
}

@CommandHandler(LikeOperationForCommentCommand)
export class LikeOperationForCommentUseCase implements ICommandHandler<LikeOperationForCommentCommand> {
    constructor(private commentsRepository: CommentsRepository, private queryBus: QueryBus) {}

    async execute(command: LikeOperationForCommentCommand): Promise<boolean> {
        // Find the comment with the given id
        const comment = await this.queryBus.execute(new GetCommentByIdForLikeOperationCommand(command.id));
        if (!comment) {
            // Return false if the comment is not found
            return false;
        }

        // Check if the user is liking, disliking, or removing their like/dislike
        const isLike = command.likeStatus === "Like";
        const isDislike = command.likeStatus === "Dislike";
        const isNone = command.likeStatus === "None";

        // Check if the user has already liked or disliked the comment
        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(command.userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(command.userId);
        // Declare an update object that will be used to update the comment

        let update: any = {};

        // Update the like/dislike count and user lists based on the likeStatus
        if (isLike && !isLiked && !isDisliked) {
            // Increment the like count and add the user to the list of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.myStatus": command.likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
        } else if (isDislike && !isDisliked && !isLiked) {
            // Increment the dislike count and add the user to the list of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": command.likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
        } else if (isLiked && isDislike) {
            // Decrement the like count, increment the dislike count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
        } else if (isDisliked && isLike) {
            // Decrement the dislike count, increment the like count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount - 1,
                "likesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
        } else if (isLiked && isNone) {
            // Decrement the like count, and update the lists of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
        } else if (isDisliked && isNone) {
            // Decrement the dislike count, and update the lists of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount - 1,
                "likesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
        }

        return this.commentsRepository.likeOperation(command.id, update);
    }
}
