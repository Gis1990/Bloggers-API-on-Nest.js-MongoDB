import { Injectable } from "@nestjs/common";
import { InputModelForCreatingAndUpdatingPost } from "../dto/posts.dto";
import { PostViewModelClass } from "../entities/posts.entity";
import { ExtendedLikesInfoClass, UsersLikesInfoClass } from "../posts.schema";
import { BlogsQueryRepository } from "../../blogs/blogs.query.repository";
import { PostsRepository } from "../posts.repository";

@Injectable()
export class CreatePostUseCase {
    constructor(private blogsQueryRepository: BlogsQueryRepository, private postsRepository: PostsRepository) {}

    async execute(dto: InputModelForCreatingAndUpdatingPost): Promise<PostViewModelClass> {
        const blog = await this.blogsQueryRepository.getBlogById(dto.blogId);
        let blogName;
        blog ? (blogName = blog.name) : (blogName = "");
        const extendedLikesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass();
        const usersLikes: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdPostDto = {
            id: Number(new Date()).toString(),
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blogName,
            createdAt: new Date(),
            extendedLikesInfo: extendedLikesInfo,
            usersLikesInfo: usersLikes,
        };

        return await this.postsRepository.createPost(createdPostDto);
    }
}
