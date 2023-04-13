import { Controller, Get, HttpCode, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { BlogsIdValidationModel } from "../../dtos/blogs.dto";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { join } from "node:path";
import { readFileAsync } from "../utils/fs/fs.utils";
import { SaveWallpaperForBlogCommand } from "../../commands/blogs/save-wallpaper-for-blog-use-case";
import { SaveMainImageForBlogCommand } from "../../commands/blogs/save-main-image-for-blog-use-case";
import { ValidateBlogId, ValidatePostId } from "../../decorators/blogger/blogger.custom.decorators";
import { PostsIdValidationModel } from "../../dtos/posts.dto";
import { SaveMainImageForPostCommand } from "../../commands/posts/save-main-image-for-post-use-case";

@ApiTags("Blogs")
@Controller("blogger")
export class UploadsController {
    constructor(private commandBus: CommandBus) {}

    @Get("/blogs/:id/images/wallpaper")
    async getImage(@Param() params: BlogsIdValidationModel): Promise<any> {
        return await readFileAsync(join("views", "wallpapers", "wallpaper.html"));
    }

    @Get("/blogs/:id/images/main")
    async getImage2(@Param() params: BlogsIdValidationModel): Promise<any> {
        return await readFileAsync(join("views", "wallpapers", "wallpaper.html"));
    }

    @Post("/blogs/:id/images/wallpaper")
    @UseGuards(JwtAccessTokenAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(201)
    async uploadWallpaperForBlog(
        @UploadedFile()
        file: Express.Multer.File,
        @Param() params: BlogsIdValidationModel,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<any> {
        return await this.commandBus.execute(
            new SaveWallpaperForBlogCommand(params.id, file.originalname, user.id, file.buffer),
        );
    }

    @Post("/blogs/:id/images/main")
    // @UseGuards(JwtAccessTokenAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(201)
    async uploadMainImageForBlog(
        @UploadedFile()
        file: Express.Multer.File,
        @Param() params: BlogsIdValidationModel,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<any> {
        return await this.commandBus.execute(
            new SaveMainImageForBlogCommand(params.id, file.originalname, "5", file.buffer),
        );
    }

    @Post("blogs/:blogId/posts/:postId/images/main")
    @UseGuards(JwtAccessTokenAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(201)
    async uploadMainImageForPost(
        @ValidateBlogId() blogId: BlogsIdValidationModel,
        @ValidatePostId() postId: PostsIdValidationModel,
        @UploadedFile()
        file: Express.Multer.File,
        @Param() params: BlogsIdValidationModel,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<any> {
        return await this.commandBus.execute(
            new SaveMainImageForPostCommand(postId.toString(), file.originalname, user.id, file.buffer),
        );
    }
}
