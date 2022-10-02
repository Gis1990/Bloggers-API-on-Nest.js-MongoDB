import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BloggersModule } from "./features/bloggers/bloggers.module";
import { PostsModule } from "./features/posts/posts.module";
import { UsersModule } from "./features/users/users.module";
import { AuthModule } from "./features/auth/auth.module";
import { GamequizModule } from "./features/gamequiz/gamequiz.module";
import { ConfigModule } from "@nestjs/config";
import { config } from "./config/config";
import { CommentsModule } from "./features/comments/comments.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        BloggersModule,
        PostsModule,
        UsersModule,
        AuthModule,
        GamequizModule,
        CommentsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
