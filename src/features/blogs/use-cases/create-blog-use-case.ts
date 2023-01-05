import { Injectable } from "@nestjs/common";
import { InputModelForCreatingBlog } from "../dto/blogs.dto";
import { BlogResponseModelClass } from "../entities/blogs.entity";
import { BlogsRepository } from "../blogs.repository";

@Injectable()
export class CreateBlogUseCase {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(dto: InputModelForCreatingBlog): Promise<BlogResponseModelClass> {
        const createdBlogDto = { ...dto, id: Number(new Date()).toString(), createdAt: new Date() };
        return await this.blogsRepository.createBlog(createdBlogDto);
    }
}
