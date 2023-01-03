import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogDBClass, BlogsSchema } from "../blogs/blogs.schema";
import { PostDBClass, PostsSchema } from "../posts/postsSchema";
import { CommentDBClass, CommentsSchema } from "../comments/comments.schema";
import { UserAccountDBClass, UsersAccountSchema } from "../users/users.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: BlogDBClass.name,
                schema: BlogsSchema,
            },
            {
                name: PostDBClass.name,
                schema: PostsSchema,
            },
            {
                name: CommentDBClass.name,
                schema: CommentsSchema,
            },
            {
                name: UserAccountDBClass.name,
                schema: UsersAccountSchema,
            },
        ]),
    ],
    controllers: [TestingController],
    providers: [],
    exports: [],
})
export class TestingModule {}
