import {
    CommentForBloggerPaginationClass,
    CommentPaginationClass,
    CommentViewModelClass,
    CommentViewModelForBloggerClass,
} from "./entities/comments.entity";
import { ModelForGettingAllComments } from "./dto/comments.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentClass } from "./comments.schema";
import { BlogClass } from "../blogs/blogs.schema";
import { PostClass } from "../posts/posts.schema";
import { UserAccountClass } from "../super-admin/users/users.schema";
import { getBannedUsersIdsBySuperAdmin } from "../../helpers/helpers.for.query.repositories";
import { getLikesDataInfoForComment } from "./mappers/get.likes.info.for.comments.mapper";

export class CommentsQueryRepository {
    constructor(
        @InjectModel(CommentClass.name) private commentsModelClass: Model<CommentClass>,
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(UserAccountClass.name) private userAccountClass: Model<UserAccountClass>,
    ) {}

    async getCommentById(id: string, userId: string | undefined): Promise<CommentViewModelClass> {
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        const comment = await this.commentsModelClass.findOne({ id: id });
        const correctComment = await getLikesDataInfoForComment(userId, bannedUsersIdsBySuperAdmin, comment);
        return await correctComment.transformToCommentViewModelClass();
    }

    async getAllCommentsForSpecificPost(
        dto: ModelForGettingAllComments,
        postId: string,
        userId: string | undefined,
    ): Promise<CommentPaginationClass> {
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
        const cursor = await this.commentsModelClass.find({ postId: postId }).sort(sortObj).skip(skips).limit(PageSize);
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        cursor.forEach((elem) => {
            getLikesDataInfoForComment(userId, bannedUsersIdsBySuperAdmin, elem);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return elem.transformToCommentViewModelClass();
        });
        // Count the total number of documents that match the query
        const totalCount = await this.commentsModelClass.count({ postId: postId });
        // Return a new CommentDBClassPagination object with the calculated pagination information and the retrieved documents
        return new CommentPaginationClass(
            Math.ceil(totalCount / PageSize),
            PageNumber,
            PageSize,
            totalCount,
            await Promise.all(cursorWithCorrectViewModel),
        );
    }

    async getAllCommentsForAllPostsForBloggersBlogs(
        dto: ModelForGettingAllComments,
        userId: string,
    ): Promise<CommentForBloggerPaginationClass> {
        const { PageNumber = 1, PageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
        const skips = PageSize * (PageNumber - 1);
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const allBloggersBlogsIds = await this.blogsModelClass
            .find({ $and: [{ "blogOwnerInfo.userId": userId }, { "banInfo.isBanned": false }] }, {})
            .select("id");
        const allPostsIds = await this.postsModelClass.find({ $in: [...allBloggersBlogsIds] }, {}).select("id");
        const cursor = await this.commentsModelClass
            .find({ $in: [...allPostsIds] }, {})
            .sort(sortObj)
            .skip(skips)
            .limit(PageSize);
        const bannedUsersIdsBySuperAdmin = await getBannedUsersIdsBySuperAdmin();
        cursor.forEach((elem) => {
            getLikesDataInfoForComment(userId, bannedUsersIdsBySuperAdmin, elem);
        });
        const cursorWithCorrectViewModel = cursor.map((elem) => {
            return new CommentViewModelForBloggerClass(
                elem.id,
                elem.content,
                elem.createdAt,
                elem.likesInfo,
                elem.commentatorInfo,
                elem.postInfo,
            );
        });
        // Count the total number of documents that match the query
        const totalCount = await this.commentsModelClass.count({ $in: [...allPostsIds] });
        // Return a new CommentDBClassPagination object with the calculated pagination information and the retrieved documents
        return new CommentForBloggerPaginationClass(
            Math.ceil(totalCount / PageSize),
            PageNumber,
            PageSize,
            totalCount,
            await Promise.all(cursorWithCorrectViewModel),
        );
    }

    async getCommentByIdForLikeOperation(id: string): Promise<CommentClass> {
        return this.commentsModelClass.findOne({ id: id });
    }

    async getCommentForIdValidation(id: string): Promise<CommentClass | null> {
        const bannedUserIdsInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
        const bannedUsersIds = bannedUserIdsInDB.map((elem) => elem.id);
        const comment = await this.commentsModelClass.findOne({ id: id });
        if (!comment || bannedUsersIds.includes(comment.commentatorInfo.userId)) {
            return null;
        } else {
            return comment;
        }
    }
}
