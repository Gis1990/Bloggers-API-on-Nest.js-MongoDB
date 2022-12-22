import { IsBlogsIdExistInTheRequestBody } from "../../blogs/blogs.custom.decorators";
import { IsString, Length, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsPostIdExist } from "../posts.custom.decorators";
import { Type } from "class-transformer";

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

export class InputModelForCreatingAndUpdatingPost {
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    public title: string;
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    public shortDescription: string;
    @IsString()
    @Length(1, 1000)
    @IsNotEmpty()
    public content: string;
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExistInTheRequestBody({
        message: "BlogsId is not exist",
    })
    public blogId: string;
}

export class InputModelForCreatingNewPostForSpecificBlog {
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    public title: string;
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    public shortDescription: string;
    @IsString()
    @Length(1, 1000)
    @IsNotEmpty()
    public content: string;
}

export class PostsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsPostIdExist()
    public id: string;
}
