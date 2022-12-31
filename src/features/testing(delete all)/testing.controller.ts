import { Controller, Delete, HttpCode } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogDBClass } from "../blogs/blogs.schema";
import { PostDBClass } from "../posts/posts.schema";
import { CommentDBClass } from "../comments/comments.schema";
import { UserAccountDBClass } from "../users/users.schema";

@SkipThrottle()
@Controller("testing")
export class TestingController {
    constructor(
        @InjectModel(BlogDBClass.name) private blogsModelClass: Model<BlogDBClass>,
        @InjectModel(PostDBClass.name) private postsModelClass: Model<PostDBClass>,
        @InjectModel(CommentDBClass.name) private commentsModelClass: Model<CommentDBClass>,
        @InjectModel(UserAccountDBClass.name) private userAccountModelClass: Model<UserAccountDBClass>,
    ) {}

    @Delete("/all-data")
    @HttpCode(204)
    async deleteBlog(): Promise<boolean> {
        await this.blogsModelClass.deleteMany({});
        await this.postsModelClass.deleteMany({});
        await this.commentsModelClass.deleteMany({});
        await this.userAccountModelClass.deleteMany({});
        return true;
    }
}
