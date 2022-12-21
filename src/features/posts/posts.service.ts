import { PostsRepository } from "./posts.repository";
import { ObjectId } from "mongodb";
import { Injectable } from "@nestjs/common";
import {
    ExtendedLikesInfoClass,
    NewestLikesClass,
    NewPostClassResponseModel,
    PostDBClass,
    UsersLikesInfoClass,
} from "./entities/posts.entity";
import { InputModelForCreatingAndUpdatingPost } from "./dto/posts.dto";
import { BlogsQueryRepository } from "../blogs/blogs.query.repository";
import { PostsQueryRepository } from "./posts.query.repository";

@Injectable()
export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected postsQueryRepository: PostsQueryRepository,
    ) {}

    async createPost(dto: InputModelForCreatingAndUpdatingPost): Promise<NewPostClassResponseModel> {
        const blog = await this.blogsQueryRepository.getBlogById(dto.blogId);
        let blogName;
        blog ? (blogName = blog.name) : (blogName = "");
        const likesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass(0, 0, "None", []);
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass([], []);
        const post: PostDBClass = new PostDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.title,
            dto.shortDescription,
            dto.content,
            dto.blogId,
            blogName,
            new Date(),
            likesInfo,
            usersLikesInfo,
        );
        const newPost = await this.postsRepository.createPost(post);
        return (({ id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo }) => ({
            id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
            extendedLikesInfo,
        }))(newPost);
    }

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, blogId);
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }

    async likeOperation(id: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        // Find the post with the given ID
        const post = await this.postsQueryRepository.getPostByIdForLikeOperation(id);

        // If the post does not exist, return false
        if (!post) {
            return false;
        }
        // Check if the user has already liked or disliked the post
        const isLiked = post.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = post.usersLikesInfo.usersWhoPutDislike.includes(userId);

        // Declare an update object that will be used to update the post
        let update: any = {};

        // If the user wants to like the post and has not already liked or disliked it,
        // change users status to Like,
        // increase the likes count and add the user to the list of users who liked the post
        if (likeStatus === "Like" && !isLiked && !isDisliked) {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $push: {
                    "extendedLikesInfo.newestLikes": new NewestLikesClass(new Date(), userId, login),
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
        }

        // If the user wants to dislike the post and has not already liked or disliked it,
        // increase the dislikes count and add the user to the list of users who disliked the post
        else if (likeStatus === "Dislike" && !isDisliked && !isLiked) {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
            // If the user wants to change his status to None,but don't have like or dislike status
        } else if (likeStatus === "None" && !isDisliked && !isLiked) {
            update = {
                "extendedLikesInfo.myStatus": likeStatus,
            };
            // If the user wants to change his status to None and has already liked the post,
            // decrease the likes count,
            // remove the user from the list of users who liked the post,
        } else if (likeStatus === "None" && isLiked) {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount - 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $pull: {
                    "extendedLikesInfo.newestLikes": { userId: userId },
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
            // If the user wants to change his status to None and has already disliked the post,
            // decrease the dislikes count,
            // remove the user from the list of users who disliked the post,
        } else if (likeStatus === "None" && isDisliked) {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount - 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        }
        // If the user has already liked the post and wants to dislike it,
        // decrease the likes count, increase the dislikes count,
        // remove the user from the list of users who liked the post, and add them to the list of users who disliked the post
        else if (isLiked && likeStatus === "Dislike") {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount - 1,
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $pull: {
                    "extendedLikesInfo.newestLikes": { userId: userId },
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        }

        // If the user has already disliked the post and wants to like it,
        // decrease the dislikes count, increase the likes count,
        // remove the user from the list of users who disliked the post, and add them to the list of users who liked the post
        else if (isDisliked && likeStatus === "Like") {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount - 1,
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
                $push: {
                    "extendedLikesInfo.newestLikes": new NewestLikesClass(new Date(), userId, login),
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };
        }
        return this.postsRepository.likeOperation(id, update);
    }
}
