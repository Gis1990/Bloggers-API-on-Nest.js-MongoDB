import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BloggersModule } from "./bloggers/bloggers.module";
import { PostsModule } from "./posts/posts.module";

@Module({
    imports: [BloggersModule, PostsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
