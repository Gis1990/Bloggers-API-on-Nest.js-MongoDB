import { Injectable } from "@nestjs/common";
import { BloggersRepository } from "./bloggers.repository";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./entities/bloggers.entity";
import {
    InputModelForCreatingBlogger,
    InputModelForUpdatingBlogger,
    ModelForGettingAllBloggers,
} from "./dto/bloggers.dto";

@Injectable()
export class BloggersService {
    constructor(protected bloggersRepository: BloggersRepository) {}
    async getAllBloggers(dto: ModelForGettingAllBloggers): Promise<BloggerDBClassPagination> {
        return this.bloggersRepository.getAllBloggers(dto);
    }
    async getBloggerById(bloggerId: string): Promise<BloggerDBClass | null> {
        return this.bloggersRepository.getBloggerById(bloggerId);
    }
    async createBlogger(dto: InputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        return await this.bloggersRepository.createBlogger(dto);
    }
    async updateBlogger(dto: InputModelForUpdatingBlogger): Promise<boolean> {
        return this.bloggersRepository.updateBlogger(dto);
    }
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return this.bloggersRepository.deleteBloggerById(bloggerId);
    }
}
