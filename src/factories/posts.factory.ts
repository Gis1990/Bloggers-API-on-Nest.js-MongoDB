import { PostClass } from "../schemas/posts.schema";
import { PostViewModelClass, PostViewModelClassPagination } from "../entities/posts.entity";
import { PostClassPaginationDto } from "../dtos/posts.dto";

export class PostsFactory {
    static async createPostViewModelClass(post: PostClass): Promise<PostViewModelClass> {
        return new PostViewModelClass(
            post.id,
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt,
            post.extendedLikesInfo,
        );
    }

    static async createPostViewModelClassPagination(
        dto: PostClassPaginationDto,
    ): Promise<PostViewModelClassPagination> {
        const result = await Promise.all(
            dto.items.map((elem) => {
                return PostsFactory.createPostViewModelClass(elem);
            }),
        );
        return new PostViewModelClassPagination(dto.pagesCount, dto.page, dto.pageSize, dto.totalCount, result);
    }
}
