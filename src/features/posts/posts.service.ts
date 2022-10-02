import { PostsRepository } from "./posts.repository";
import { ObjectId } from "mongodb";
import { BloggersRepository } from "../bloggers/bloggers.repository";
import { Injectable } from "@nestjs/common";
import {
    ExtendedLikesInfoClass,
    NewPostClassResponseModel,
    PostDBClass,
    PostDBClassPagination,
    UsersLikesInfoClass,
} from "./entities/posts.entity";
import { InputModelForCreatingAndUpdatingPost, ModelForGettingAllPosts } from "./dto/posts.dto";

@Injectable()
export class PostsService {
    constructor(protected bloggersRepository: BloggersRepository, protected postsRepository: PostsRepository) {}
    async getAllPosts(dto: ModelForGettingAllPosts, userId: string | undefined): Promise<PostDBClassPagination> {
        const allPosts = await this.postsRepository.getAllPosts(dto);
        if (userId) {
            for (let i = 0; i < allPosts.items.length; i++) {
                allPosts.items[i].extendedLikesInfo.newestLikes = allPosts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                allPosts.items[i].extendedLikesInfo.myStatus = await this.postsRepository.returnUsersLikeStatus(
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
    async getAllPostsForSpecificBlogger(
        model: ModelForGettingAllPosts,
        bloggerId: string,
        userId: string | undefined,
    ): Promise<PostDBClassPagination> {
        const posts = await this.postsRepository.getAllPostsForSpecificBlogger(model, bloggerId);
        if (userId) {
            for (let i = 0; i < posts.items.length; i++) {
                posts.items[i].extendedLikesInfo.newestLikes = posts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                posts.items[i].extendedLikesInfo.myStatus = await this.postsRepository.returnUsersLikeStatus(
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
        const post = await this.postsRepository.getPostById(id);
        if (!post) {
            return null;
        }
        post.extendedLikesInfo.newestLikes = post?.extendedLikesInfo.newestLikes
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        if (userId) {
            post.extendedLikesInfo.myStatus = await this.postsRepository.returnUsersLikeStatus(id, userId);
        } else {
            post.extendedLikesInfo.myStatus = "None";
        }
        return post;
    }
    async createPost(dto: InputModelForCreatingAndUpdatingPost): Promise<NewPostClassResponseModel> {
        const blogger = await this.bloggersRepository.getBloggerById(dto.bloggerId);
        let bloggerName;
        blogger ? (bloggerName = blogger.name) : (bloggerName = "");
        const likesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass(0, 0, "None", []);
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass([], []);
        const post: PostDBClass = new PostDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.title,
            dto.shortDescription,
            dto.content,
            dto.bloggerId,
            bloggerName,
            new Date(),
            likesInfo,
            usersLikesInfo,
        );
        const newPost = await this.postsRepository.createPost(post);
        return (({ id, title, shortDescription, content, bloggerId, bloggerName, addedAt, extendedLikesInfo }) => ({
            id,
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName,
            addedAt,
            extendedLikesInfo,
        }))(newPost);
    }
    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: string,
    ): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, bloggerId);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }
    async likeOperation(id: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        return this.postsRepository.likeOperation(id, userId, login, likeStatus);
    }
}
