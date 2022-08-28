import { PostsRepository } from "./posts.repository";
import {
    ExtendedLikesInfoClass,
    NewPostClassResponseModel,
    PostDBClass,
    PostDBClassPagination,
    UsersLikesInfoClass,
} from "../entity/types";
import { ObjectId } from "mongodb";
import { BloggersRepository } from "../bloggers/bloggers.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class PostsService {
    constructor(
        @Inject(forwardRef(() => BloggersRepository)) protected bloggersRepository: BloggersRepository,
        protected postsRepository: PostsRepository,
    ) {}
    async getAllPosts(PageNumber = 1, PageSize = 10, userId: string | undefined): Promise<PostDBClassPagination> {
        const allPosts = await this.postsRepository.getAllPosts(Number(PageNumber), Number(PageSize));
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
        PageNumber = 1,
        PageSize = 10,
        bloggerId: string,
        userId: string | undefined,
    ): Promise<PostDBClassPagination> {
        const posts = await this.postsRepository.getAllPostsForSpecificBlogger(
            Number(PageNumber),
            Number(PageSize),
            bloggerId,
        );
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
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: string,
    ): Promise<NewPostClassResponseModel> {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
        let bloggerName;
        blogger ? (bloggerName = blogger.name) : (bloggerName = "");
        const likesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass(0, 0, "None", []);
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass([], []);
        const post: PostDBClass = new PostDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            title,
            shortDescription,
            content,
            bloggerId,
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
