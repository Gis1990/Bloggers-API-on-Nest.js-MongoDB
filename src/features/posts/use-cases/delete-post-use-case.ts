import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../posts.repository";

@Injectable()
export class DeletePostUseCase {
    constructor(private postsRepository: PostsRepository) {}

    async execute(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }
}
