import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { BloggersModule } from "../bloggers/bloggers.module";

@Module({
    imports: [forwardRef(() => BloggersModule)],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService],
})
export class PostsModule {}
