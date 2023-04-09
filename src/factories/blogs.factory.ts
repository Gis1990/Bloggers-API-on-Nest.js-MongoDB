import { BlogViewModelClass, BlogViewModelClassPagination } from "../entities/blogs.entity";
import { BlogClass } from "../schemas/blogs.schema";
import { BlogClassPaginationDto } from "../dtos/blogs.dto";

export class BlogsFactory {
    static async createBlogViewModelClass(blog: BlogClass): Promise<BlogViewModelClass> {
        return new BlogViewModelClass(
            blog.id,
            blog.name,
            blog.description,
            blog.websiteUrl,
            blog.createdAt,
            blog.isMembership,
            blog.images,
        );
    }

    static async createBlogViewModelPaginationClass(
        dto: BlogClassPaginationDto,
    ): Promise<BlogViewModelClassPagination> {
        return new BlogViewModelClassPagination(dto.pagesCount, dto.page, dto.pageSize, dto.totalCount, dto.items);
    }
}
