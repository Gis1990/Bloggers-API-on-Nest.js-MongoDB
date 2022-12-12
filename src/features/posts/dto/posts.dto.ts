import { IsBlogsIdExist } from "../../blogs/blogs.custom.decorators";
import { IsString, Length, IsNotEmpty } from "class-validator";
import { IsPostIdExist } from "../posts.custom.decorators";

export class ModelForGettingAllPosts {
    PageNumber: number;
    PageSize: number;
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

export class InputModelForCreatingNewPostForSpecificblog {
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
