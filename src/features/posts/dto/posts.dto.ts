import { IsBlogsIdExist } from "../../blogs/blogs.custom.decorators";
import { IsString, Length, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsPostIdExist } from "../posts.custom.decorators";
import { Type } from "class-transformer";

export class ModelForGettingAllPosts {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    pageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    pageSize: number;
    @IsString()
    @IsOptional()
    sortBy: string;
    @IsString()
    @IsOptional()
    sortDirection: string;
}

export class InputModelForCreatingAndUpdatingPost {
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    title: string;
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    shortDescription: string;
    @IsString()
    @Length(1, 1000)
    @IsNotEmpty()
    content: string;
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExist()
    blogId: string;
}

export class InputModelForCreatingNewPostForSpecificBlog {
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    title: string;
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    shortDescription: string;
    @IsString()
    @Length(1, 1000)
    @IsNotEmpty()
    content: string;
}

export class PostsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsPostIdExist()
    id: string;
}
