import { Module } from "@nestjs/common";
import { config } from "./config/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogsModule } from "./features/blogs/blogs.module";
import { PostsModule } from "./features/posts/posts.module";
import { UsersModule } from "./features/users/users.module";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { CommentsModule } from "./features/comments/comments.module";
import { TestingModule } from "./features/testing(delete all)/testing.module";
import { SecurityModule } from "./features/security/security.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        BlogsModule,
        PostsModule,
        UsersModule,
        AuthModule,
        CommentsModule,
        TestingModule,
        SecurityModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
