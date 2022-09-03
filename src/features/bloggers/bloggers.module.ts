import { forwardRef, Module } from "@nestjs/common";
import { BloggersService } from "./bloggers.service";
import { BloggersRepository } from "./bloggers.repository";
import { BloggersController } from "./bloggers.controller";
import { IsBloggersIdExistConstraint } from "./bloggers.custom.decorators";
import { PostsModule } from "../posts/posts.module";

@Module({
    imports: [forwardRef(() => PostsModule)],
    controllers: [BloggersController],
    providers: [BloggersService, BloggersRepository, IsBloggersIdExistConstraint],
    exports: [BloggersRepository],
})
export class BloggersModule {}
