import { Injectable } from "@nestjs/common";
import { InputModelForUpdatingBlog } from "../dto/blogs.dto";
import { BlogsRepository } from "../blogs.repository";

@Injectable()
export class UpdateBlogUseCase {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(blogId: string, dto: InputModelForUpdatingBlog): Promise<boolean> {
        return this.blogsRepository.updateBlog(blogId, dto);
    }
}
