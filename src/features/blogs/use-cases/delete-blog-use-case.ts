import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "../blogs.repository";

@Injectable()
export class DeleteBlogUseCase {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(blogId: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(blogId);
    }
}
