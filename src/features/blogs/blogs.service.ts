import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogResponseModelClass } from "./entities/blogs.entity";
import { InputModelForCreatingBlog, InputModelForUpdatingBlog } from "./dto/blogs.dto";

@Injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async createBlog(dto: InputModelForCreatingBlog): Promise<BlogResponseModelClass> {
        const createdBlogDto = { ...dto, id: Number(new Date()).toString(), createdAt: new Date() };
        return await this.blogsRepository.createBlog(createdBlogDto);
    }

    async updateBlog(blogId: string, dto: InputModelForUpdatingBlog): Promise<boolean> {
        return this.blogsRepository.updateBlog(blogId, dto);
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(blogId);
    }
}
