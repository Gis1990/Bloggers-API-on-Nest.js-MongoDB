import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentClass } from "../schemas/comments.schema";
import { CreatedCommentDto } from "../dtos/comments.dto";

export class CommentsRepository {
    constructor(@InjectModel(CommentClass.name) private commentsModelClass: Model<CommentClass>) {}

    async createComment(newComment: CreatedCommentDto): Promise<CommentClass> {
        const comment = new this.commentsModelClass(newComment);
        await comment.save();
        return comment;
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await this.commentsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await this.commentsModelClass.updateOne({ id: id }, { $set: { content } });
        return result.matchedCount === 1;
    }

    async likeOperation(id: string, update: any): Promise<boolean> {
        const result = await this.commentsModelClass.updateOne({ id: id }, update);
        return result.matchedCount === 1;
    }
}
