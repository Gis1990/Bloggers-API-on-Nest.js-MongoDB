import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogClassResponseModel, BlogDBClass, BlogDBClassPagination } from "./entities/blogs.entity";
import {
    InputModelForCreatingBlog,
    InputModelForUpdatingBlog,
    ModelForGettingAllBlogs,
} from "./dto/blogs.dto";

@Injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}
    async getAllBlogs(dto: ModelForGettingAllBlogs): Promise<BlogDBClassPagination> {
        return this.blogsRepository.getAllBlogs(dto);
    }
    async getBlogById(blogId: string): Promise<BlogDBClass | null> {
        return this.blogsRepository.getBlogById(blogId);
    }
    async createBlog(dto: InputModelForCreatingBlog): Promise<BlogClassResponseModel> {
        return await this.blogsRepository.createBlog(dto);
    }
    async updateBlog(dto: InputModelForUpdatingBlog): Promise<boolean> {
        return this.blogsRepository.updateBlog(dto);
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(blogId);
    }
}
