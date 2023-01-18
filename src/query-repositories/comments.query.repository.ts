import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentClass } from "../schemas/comments.schema";
import { QueryDto } from "../dtos/blogs.dto";
import { CommentClassPaginationDto } from "../dtos/comments.dto";

export class CommentsQueryRepository {
    constructor(@InjectModel(CommentClass.name) private commentsModelClass: Model<CommentClass>) {}

    async getCommentById(id: string): Promise<CommentClass | null> {
        const comment = await this.commentsModelClass.findOne({ id: id });
        if (!comment) {
            return null;
        }
        return comment;
    }

    async getAllCommentsForSpecificPost(
        queryDtoForComments: QueryDto,
        postId: string,
    ): Promise<CommentClassPaginationDto> {
        const cursor = await this.commentsModelClass
            .find({ $and: [queryDtoForComments.query, { postId: postId }] })
            .sort(queryDtoForComments.sortObj)
            .skip(queryDtoForComments.skips)
            .limit(queryDtoForComments.pageSize);
        const totalCount = await this.commentsModelClass.count({ postId: postId });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForComments.pageSize),
            page: queryDtoForComments.pageNumber,
            pageSize: queryDtoForComments.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllCommentsForAllPostsForBloggersBlogs(
        queryDtoForComments: QueryDto,
        allBannedBlogsIds: string[],
    ): Promise<CommentClassPaginationDto> {
        const cursor = await this.commentsModelClass
            .find({ $and: [queryDtoForComments.query, { "postInfo.blogId": { $nin: [...allBannedBlogsIds] } }] }, {})
            .sort(queryDtoForComments.sortObj)
            .skip(queryDtoForComments.skips)
            .limit(queryDtoForComments.pageSize);
        const totalCount = await this.commentsModelClass.count({ id: { $nin: [...allBannedBlogsIds] } });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForComments.pageSize),
            page: queryDtoForComments.pageNumber,
            pageSize: queryDtoForComments.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getCommentByIdForLikeOperation(id: string): Promise<CommentClass> {
        return this.commentsModelClass.findOne({ id: id });
    }
}
