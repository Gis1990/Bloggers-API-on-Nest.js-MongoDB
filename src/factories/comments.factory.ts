import {
    CommentViewModelClass,
    CommentViewModelForBloggerClass,
    CommentViewModelForBloggerPaginationClass,
    CommentViewModelPaginationClass,
} from "../entities/comments.entity";
import { CommentClass } from "../schemas/comments.schema";
import { CommentClassPaginationDto } from "../dtos/comments.dto";

export class CommentsFactory {
    static async createCommentViewModelClass(comment: CommentClass): Promise<CommentViewModelClass> {
        return new CommentViewModelClass(
            comment.id,
            comment.content,
            comment.commentatorInfo,
            comment.createdAt,
            comment.likesInfo,
        );
    }

    static async createCommentViewModelForBloggerClass(
        comment: CommentClass,
    ): Promise<CommentViewModelForBloggerClass> {
        return new CommentViewModelForBloggerClass(
            comment.id,
            comment.content,
            comment.createdAt,
            comment.likesInfo,
            comment.commentatorInfo,
            comment.postInfo,
        );
    }

    static async createCommentViewModelClassPagination(
        dto: CommentClassPaginationDto,
    ): Promise<CommentViewModelPaginationClass> {
        const result = await Promise.all(
            dto.items.map((elem) => {
                return CommentsFactory.createCommentViewModelClass(elem);
            }),
        );
        return new CommentViewModelPaginationClass(dto.pagesCount, dto.page, dto.pageSize, dto.totalCount, result);
    }

    static async createCommentViewModelForBloggerPaginationClass(
        dto: CommentClassPaginationDto,
    ): Promise<CommentViewModelForBloggerPaginationClass> {
        const result = await Promise.all(
            dto.items.map((elem) => {
                return CommentsFactory.createCommentViewModelForBloggerClass(elem);
            }),
        );
        return new CommentViewModelForBloggerPaginationClass(
            dto.pagesCount,
            dto.page,
            dto.pageSize,
            dto.totalCount,
            result,
        );
    }
}
