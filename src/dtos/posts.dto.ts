import { IsBlogsIdExistInTheRequestBody } from "../decorators/blogs/blogs.custom.decorators";
import { IsString, Length, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsPostIdExist } from "../decorators/posts/posts.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { ImagesForPostsClass, PostClass, UsersLikesInfoClass } from "../schemas/posts.schema";
import { LikesInfoClass } from "../schemas/comments.schema";
import { ApiProperty } from "@nestjs/swagger";

export class ModelForGettingAllPosts {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageSize: number;
    @IsString()
    @IsOptional()
    public sortBy: string;
    @IsString()
    @IsOptional()
    public sortDirection: string;
}

export class InputModelForCreatingAndUpdatingNewPostForSpecificBlog {
    @ApiProperty({ type: String, description: "The title of the post", maxLength: 30 })
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public title: string;
    @ApiProperty({ type: String, description: "The short description of the post", maxLength: 100 })
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public shortDescription: string;
    @ApiProperty({ type: String, description: "The content of the post", maxLength: 1000 })
    @IsString()
    @Length(1, 1000)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public content: string;
}

export class InputModelForCreatingAndUpdatingPost extends InputModelForCreatingAndUpdatingNewPostForSpecificBlog {
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExistInTheRequestBody({
        message: "BlogsId is not exist",
    })
    public blogId: string;
}

export class PostsIdValidationModel {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @IsPostIdExist()
    public postId: string;
}

export class CreatedPostDto {
    public id: string;
    public title: string;
    public shortDescription: string;
    public content: string;
    public blogId: string;
    public blogName: string;
    public createdAt: Date;
    public extendedLikesInfo: LikesInfoClass;
    public usersLikesInfo: UsersLikesInfoClass;
    public images: ImagesForPostsClass;
}

export class PostClassPaginationDto {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: PostClass[];
}
