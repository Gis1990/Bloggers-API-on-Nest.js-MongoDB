import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import { PostClass, PostsSchema } from "../../schemas/posts.schema";
import { CommentClass, CommentsSchema } from "../../schemas/comments.schema";
import { UserAccountClass, UsersAccountSchema } from "../../schemas/users.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
            {
                name: PostClass.name,
                schema: PostsSchema,
            },
            {
                name: CommentClass.name,
                schema: CommentsSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
        ]),
    ],
    controllers: [TestingController],
    providers: [],
    exports: [],
})
export class TestingModule {}
