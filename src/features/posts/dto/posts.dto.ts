import { IsBlogsIdExist } from "../../blogs/blogs.custom.decorators";
import { IsString, Length, IsNotEmpty, IsNumber } from "class-validator";
import { IsPostIdExist } from "../posts.custom.decorators";

export class ModelForGettingAllPosts {
    @IsNumber()
    pageNumber: number;
    @IsNumber()
    pageSize: number;
    @IsString()
    sortBy: string;
    @IsString()
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
