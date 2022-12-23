import { CommentDBClass, CommentDBClassPagination } from "./entities/comments.entity";
import { CommentsModelClass } from "../../db";
import { ModelForGettingAllComments } from "./dto/comments.dto";

export class CommentsQueryRepository {
    async getCommentById(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({ id: id }, { _id: 0, postId: 0, usersLikesInfo: 0 });
    }

    async getAllCommentsForSpecificPost(
        dto: ModelForGettingAllComments,
        postId: string,
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
        // Retrieve the documents from the CommentsModelClass collection, applying the sort, skip, and limit options
        const cursor = await CommentsModelClass.find(
            { postId: postId },
            {
                _id: 0,
                postId: 0,
                usersLikesInfo: 0,
            },
        )
            .sort(sortObj)
            .skip(skips)
            .limit(PageSize)
            .lean();
        // Count the total number of documents that match the query
        const totalCount = await CommentsModelClass.count({ postId: postId });
        // Return a new CommentDBClassPagination object with the calculated pagination information and the retrieved documents
        return new CommentDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }

    async getCommentByIdForLikeOperation(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({ id: id });
    }

    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const comment = await CommentsModelClass.findOne({ id: id });

        const isLiked = comment?.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment?.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }
}
