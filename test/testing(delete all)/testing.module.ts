import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogClass, BlogsSchema } from "../../src/features/blogs/blogs.schema";
import { PostClass, PostsSchema } from "../../src/features/posts/posts.schema";
import { CommentClass, CommentsSchema } from "../../src/features/comments/comments.schema";
import {
    BannedUsersBySuperAdminClass,
    BannedUsersSchema,
    UserAccountClass,
    UsersAccountSchema,
} from "../../src/features/super-admin/users/users.schema";

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
            {
                name: BannedUsersBySuperAdminClass.name,
                schema: BannedUsersSchema,
            },
        ]),
    ],
    controllers: [TestingController],
    providers: [],
    exports: [],
})
export class TestingModule {}
