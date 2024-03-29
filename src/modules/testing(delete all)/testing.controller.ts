import { Controller, Delete, HttpCode } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogClass } from "../../schemas/blogs.schema";
import { PostClass } from "../../schemas/posts.schema";
import { CommentClass } from "../../schemas/comments.schema";
import { UserAccountClass } from "../../schemas/users.schema";
import { QuestionClass } from "../../schemas/questions.schema";
import { GamesClass, TopUsersStatsClass } from "../../schemas/games.schema";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Testing")
@SkipThrottle()
@Controller("testing")
export class TestingController {
    constructor(
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(PostClass.name) private postsModelClass: Model<PostClass>,
        @InjectModel(CommentClass.name) private commentsModelClass: Model<CommentClass>,
        @InjectModel(UserAccountClass.name) private userAccountModelClass: Model<UserAccountClass>,
        @InjectModel(QuestionClass.name) private questionModelClass: Model<QuestionClass>,
        @InjectModel(GamesClass.name) private gamesModelClass: Model<GamesClass>,
        @InjectModel(TopUsersStatsClass.name) private topUsersStatsClass: Model<TopUsersStatsClass>,
    ) {}

    @ApiOperation({ summary: "Clear database: delete all data from all tables/collections" })
    @ApiResponse({ status: 204, description: "All data is deleted" })
    @Delete("/all-data")
    @HttpCode(204)
    async deleteBlog(): Promise<boolean> {
        await this.blogsModelClass.deleteMany({});
        await this.postsModelClass.deleteMany({});
        await this.commentsModelClass.deleteMany({});
        await this.userAccountModelClass.deleteMany({});
        await this.questionModelClass.deleteMany({});
        await this.gamesModelClass.deleteMany({});
        await this.topUsersStatsClass.deleteMany({});
        return true;
    }
}
