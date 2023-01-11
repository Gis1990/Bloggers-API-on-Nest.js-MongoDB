import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostsRepository } from "../posts.repository";
import { NewestLikesClass } from "../posts.schema";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetPostByIdForLikeOperationCommand } from "./queries/get-post-by-id-for-like-opertation-query";

export class LikeOperationForPostCommand {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly login: string,
        public readonly likeStatus: string,
    ) {}
}

@CommandHandler(LikeOperationForPostCommand)
export class LikeOperationForPostUseCase implements ICommandHandler<LikeOperationForPostCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private queryBus: QueryBus,
        @InjectModel(NewestLikesClass.name) private newestLikesModelClass: Model<NewestLikesClass>,
    ) {}

    async execute(command: LikeOperationForPostCommand): Promise<boolean> {
        // Find the post with the given ID
        const post = await this.queryBus.execute(new GetPostByIdForLikeOperationCommand(command.id));
        // If the post does not exist, return false
        if (!post) {
            return false;
        }
        // Check if the user has already liked or disliked the post
        const isLiked = post.usersLikesInfo.usersWhoPutLike.includes(command.userId);
        const isDisliked = post.usersLikesInfo.usersWhoPutDislike.includes(command.userId);

        // Declare an update object that will be used to update the post
        let update: any = {};

        // Declare a createdNewestLikesDto object that will be used for newestLikes entry
        const createdNewestLikesDto = {
            addedAt: new Date(),
            login: command.login,
            userId: command.userId,
        };

        // If the user wants to like the post and has not already liked or disliked it,
        // change users status to Like,
        // increase the likes count and add the user to the list of users who liked the post
        if (command.likeStatus === "Like" && !isLiked && !isDisliked) {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $push: {
                    "extendedLikesInfo.newestLikes": new this.newestLikesModelClass(createdNewestLikesDto),
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
        }

        // If the user wants to dislike the post and has not already liked or disliked it,
        // increase the dislikes count and add the user to the list of users who disliked the post
        else if (command.likeStatus === "Dislike" && !isDisliked && !isLiked) {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
            // If the user wants to change his status to None,but don't have like or dislike status
        } else if (command.likeStatus === "None" && !isDisliked && !isLiked) {
            update = {
                "extendedLikesInfo.myStatus": command.likeStatus,
            };
            // If the user wants to change his status to None and has already liked the post,
            // decrease the likes count,
            // remove the user from the list of users who liked the post,
        } else if (command.likeStatus === "None" && isLiked) {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount - 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $pull: {
                    "extendedLikesInfo.newestLikes": { userId: command.userId },
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
            // If the user wants to change his status to None and has already disliked the post,
            // decrease the dislikes count,
            // remove the user from the list of users who disliked the post,
        } else if (command.likeStatus === "None" && isDisliked) {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount - 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
        }
        // If the user has already liked the post and wants to dislike it,
        // decrease the likes count, increase the dislikes count,
        // remove the user from the list of users who liked the post, and add them to the list of users who disliked the post
        else if (isLiked && command.likeStatus === "Dislike") {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount - 1,
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $pull: {
                    "extendedLikesInfo.newestLikes": { userId: command.userId },
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
            };
        }

        // If the user has already disliked the post and wants to like it,
        // decrease the dislikes count, increase the likes count,
        // remove the user from the list of users who disliked the post, and add them to the list of users who liked the post
        else if (isDisliked && command.likeStatus === "Like") {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount - 1,
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": command.likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": command.userId,
                },
                $push: {
                    "extendedLikesInfo.newestLikes": new this.newestLikesModelClass(createdNewestLikesDto),
                    "usersLikesInfo.usersWhoPutLike": command.userId,
                },
            };
        }
        return this.postsRepository.likeOperation(command.id, update);
    }
}
