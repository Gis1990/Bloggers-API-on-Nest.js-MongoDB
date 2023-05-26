import { Controller, HttpCode, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { APIErrorResult, BlogsIdValidationModel } from "../../dtos/blogs.dto";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { SaveWallpaperForBlogCommand } from "../../commands/blogs/save-wallpaper-for-blog-use-case";
import { SaveMainImageForBlogCommand } from "../../commands/blogs/save-main-image-for-blog-use-case";
import { ValidateBlogId, ValidatePostId } from "../../decorators/blogger/blogger.custom.decorators";
import { PostsIdValidationModel } from "../../dtos/posts.dto";
import { SaveMainImageForPostCommand } from "../../commands/posts/save-main-image-for-post-use-case";
import { ImageViewModelClass } from "../../entities/blogs.entity";

@ApiBearerAuth()
@ApiTags("Blogs")
@Controller("blogger")
export class UploadsController {
    constructor(private commandBus: CommandBus) {}

    // @Get("/blogs/:id/images/wallpaper")
    // async getImage(@Param() params: BlogsIdValidationModel): Promise<any> {
    //     return await readFileAsync(join("views", "wallpapers", "wallpaper.html"));
    // }
    //
    // @Get("/blogs/:id/images/main")
    // async getImage2(@Param() params: BlogsIdValidationModel): Promise<any> {
    //     return await readFileAsync(join("views", "wallpapers", "wallpaper.html"));
    // }
    //
    // @Get("blogs/:blogId/posts/:postId/images/main")
    // async getImage3(
    //     @ValidateBlogId() blogId: BlogsIdValidationModel,
    //     @ValidatePostId() postId: PostsIdValidationModel,
    // ): Promise<any> {
    //     return await readFileAsync(join("views", "wallpapers", "wallpaper.html"));
    // }

    @ApiOperation({
        summary:
            "Upload background wallpaper for Blog (.png or .jpg (.jpeg) file (max size is 100KB, width must be 1028, height must be 312px))",
    })
    @ApiResponse({ status: 201, description: "Uploaded image information object", type: ImageViewModelClass })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({
        status: 403,
        description: "If user try to update image that doesn't belong to current user",
    })
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
    ): Promise<ImageViewModelClass> {
        return await this.commandBus.execute(
            new SaveWallpaperForBlogCommand(params.id, file.originalname, user.id, file.buffer),
        );
    }

    @ApiOperation({
        summary:
            "Upload main square image for Blog (.png or .jpg (.jpeg) file (max size is 100KB, width must be 156, height must be 156))",
    })
    @ApiResponse({ status: 201, description: "Uploaded image information object", type: ImageViewModelClass })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({
        status: 403,
        description: "If user try to update image that doesn't belong to current user",
    })
    @Post("/blogs/:id/images/main")
    @UseGuards(JwtAccessTokenAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(201)
    async uploadMainImageForBlog(
        @UploadedFile()
        file: Express.Multer.File,
        @Param() params: BlogsIdValidationModel,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<ImageViewModelClass> {
        return await this.commandBus.execute(
            new SaveMainImageForBlogCommand(params.id, file.originalname, user.id, file.buffer),
        );
    }

    @ApiOperation({
        summary:
            "Upload main image for Post (.png or .jpg (.jpeg) file (max size is 100KB, width must be 940, height must be 432))",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({
        status: 403,
        description: "If user try to update image that doesn't belong to current user",
    })
    @Post("blogs/:blogId/posts/:postId/images/main")
    @UseGuards(JwtAccessTokenAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(201)
    async uploadMainImageForPost(
        @ValidateBlogId() blogId: BlogsIdValidationModel,
        @ValidatePostId() postId: PostsIdValidationModel,
        @UploadedFile()
        file: Express.Multer.File,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<ImageViewModelClass> {
        return await this.commandBus.execute(
            new SaveMainImageForPostCommand(
                postId.toString(),
                blogId.toString(),
                file.originalname,
                user.id,
                file.buffer,
            ),
        );
    }
}
