import { Injectable } from "@nestjs/common";
import { PostDBClassPagination } from "./entities/posts.entity";
import { ModelForGettingAllPosts } from "./dto/posts.dto";
import { PostsQueryRepository } from "./posts.query.repository";
import { PostDBClass } from "./posts.schema";

@Injectable()
export class PostsQueryService {
    constructor(protected postsQueryRepository: PostsQueryRepository) {}

    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostDBClassPagination> {
        const allPosts = await this.postsQueryRepository.getAllPosts(dto);
        if (userId) {
            for (let i = 0; i < allPosts.items.length; i++) {
                allPosts.items[i].extendedLikesInfo.newestLikes = allPosts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                allPosts.items[i].extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(
                    allPosts.items[i].id,
                    userId,
                );
            }
        } else {
            allPosts.items.forEach((elem) => (elem.extendedLikesInfo.myStatus = "None"));
            allPosts.items.forEach(
                (elem) =>
                    (elem.extendedLikesInfo.newestLikes = elem.extendedLikesInfo.newestLikes
                        .slice(-3)
                        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())),
            );
        }
        return allPosts;
    }

    async getAllPostsForSpecificBlog(
        model: ModelForGettingAllPosts,
        blogId: string,
        userId: string | undefined,
    ): Promise<PostDBClassPagination> {
        const posts = await this.postsQueryRepository.getAllPostsForSpecificBlog(model, blogId);
        if (userId) {
            for (let i = 0; i < posts.items.length; i++) {
                posts.items[i].extendedLikesInfo.newestLikes = posts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                posts.items[i].extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(
                    posts.items[i].id,
                    userId,
                );
            }
        } else {
            posts.items.forEach(
                (elem) =>
                    (elem.extendedLikesInfo.newestLikes = elem.extendedLikesInfo.newestLikes
                        .slice(-3)
                        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())),
            );
            posts.items.forEach((elem) => (elem.extendedLikesInfo.myStatus = "None"));
        }
        return posts;
    }

    async getPostById(id: string, userId: string | undefined): Promise<PostDBClass | null> {
        const post = await this.postsQueryRepository.getPostById(id);
        if (!post) {
            return null;
        }
        post.extendedLikesInfo.newestLikes = post?.extendedLikesInfo.newestLikes
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        if (userId) {
            post.extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(id, userId);
        } else {
            post.extendedLikesInfo.myStatus = "None";
        }
        return post;
    }
}
