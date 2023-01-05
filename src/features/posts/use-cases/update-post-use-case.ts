import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts.repository";

@Injectable()
export class UpdatePostUseCase {
    constructor(private postsRepository: PostsRepository) {}

    async execute(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, blogId);
    }
}
