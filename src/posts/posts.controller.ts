import { Controller, Get, Query } from "@nestjs/common";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(protected postsService: PostsService) {}
    @Get()
    async getAllPosts(@Query() query: { PageNumber: number; PageSize: number }) {
        // await this.postsService.getAllPosts(query.PageNumber, query.PageSize)
        return await this.postsService.deletePost("5");
    }
}
