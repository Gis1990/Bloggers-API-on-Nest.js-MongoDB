import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogClassResponseModel, ModelForUpdatingBlog } from "./entities/blogs.entity";
import { InputModelForCreatingBlog } from "./dto/blogs.dto";

@Injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async createBlog(dto: InputModelForCreatingBlog): Promise<BlogClassResponseModel> {
        return await this.blogsRepository.createBlog(dto);
    }

    async updateBlog(dto: ModelForUpdatingBlog): Promise<boolean> {
        return this.blogsRepository.updateBlog(dto);
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(blogId);
    }
}
