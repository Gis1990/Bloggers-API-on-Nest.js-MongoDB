import { CommentDBClassPagination, CommentViewModelClass } from "./entities/comments.entity";
import { ModelForGettingAllComments } from "./dto/comments.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentDBClass, CommentDocument } from "./comments.schema";

export class CommentsQueryRepository {
    constructor(@InjectModel(CommentDBClass.name) private commentsModelClass: Model<CommentDocument>) {}

    async getCommentById(id: string, userId: string | undefined): Promise<CommentViewModelClass | null> {
        const comment = await this.commentsModelClass.findOne({ id: id });
        comment.getLikesDataInfoForComment(id, userId);
        const { _id, postId, usersLikesInfo, ...rest } = comment.toObject();
        return rest;
    }

    async getAllCommentsForSpecificPost(
        dto: ModelForGettingAllComments,
        postId: string,
        userId: string | undefined,
    ): Promise<CommentDBClassPagination> {
        const { PageNumber = 1, PageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        // Calculate the number of documents to skip based on the page size and number
        const skips = PageSize * (PageNumber - 1);
        // Create an object to store the sort criteria
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        // Retrieve the documents from the commentsModelClass collection, applying the sort, skip, and limit options
        const cursor = await this.commentsModelClass
            .find(
                { postId: postId },
                {
                    _id: 0,
                    postId: 0,
                    usersLikesInfo: 0,
                },
            )
            .sort(sortObj)
            .skip(skips)
            .limit(PageSize);
        cursor.forEach((elem) => {
            elem.getLikesDataInfoForComment(elem.id, userId);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            const { _id, postId, usersLikesInfo, ...rest } = elem.toObject();
            return rest;
        });
        // Count the total number of documents that match the query
        const totalCount = await this.commentsModelClass.count({ postId: postId });
        // Return a new CommentDBClassPagination object with the calculated pagination information and the retrieved documents
        return new CommentDBClassPagination(
            Math.ceil(totalCount / PageSize),
            PageNumber,
            PageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }

    async getCommentByIdForLikeOperation(id: string): Promise<CommentDBClass | null> {
        return this.commentsModelClass.findOne({ id: id });
    }
}
