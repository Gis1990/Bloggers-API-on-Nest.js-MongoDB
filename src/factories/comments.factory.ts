import { CommentViewModelClass } from "../entities/comments.entity";
import { CommentClass } from "../schemas/comments.schema";

export class CommentsFactory {
    static async createCommentViewModelClass(comment: CommentClass): Promise<CommentViewModelClass> {
        return new CommentViewModelClass(
            comment.id,
            comment.content,
            comment.commentatorInfo.userId,
            comment.commentatorInfo.userLogin,
            comment.createdAt,
            comment.likesInfo,
        );
    }
}
