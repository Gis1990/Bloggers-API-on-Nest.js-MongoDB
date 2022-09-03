import { Injectable } from "@nestjs/common";
import { BloggersRepository } from "./bloggers.repository";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./bloggers.model";
import {
    inputModelForUpdatingBlogger,
    inputModelForCreatingBlogger,
    modelForGettingAllBloggers,
} from "./dto/bloggers.dto";

@Injectable()
export class BloggersService {
    constructor(protected bloggersRepository: BloggersRepository) {}
    async getAllBloggers(dto: modelForGettingAllBloggers): Promise<BloggerDBClassPagination> {
        return this.bloggersRepository.getAllBloggers(dto);
    }
    async getBloggerById(bloggerId: string): Promise<BloggerDBClass | null> {
        return this.bloggersRepository.getBloggerById(bloggerId);
    }
    async createBlogger(dto: inputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        const newBlogger = await this.bloggersRepository.createBlogger(dto);
        const { _id, ...newBloggerRest } = newBlogger;
        return newBloggerRest;
    }
    async updateBlogger(dto: inputModelForUpdatingBlogger): Promise<boolean> {
        return this.bloggersRepository.updateBlogger(dto);
    }
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return this.bloggersRepository.deleteBloggerById(bloggerId);
    }
}
