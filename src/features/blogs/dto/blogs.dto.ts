import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import { IsBlogsIdExist } from "../blogs.custom.decorators";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBlogs {
    @IsString()
    SearchNameTerm: string;
    @IsNumber()
    PageNumber: number;
    @IsNumber()
    PageSize: number;
}

export class InputModelForCreatingBlog {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    @IsNotEmpty()
    youtubeUrl: string;
}

export class BlogsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExist()
    id: string;
}

export class InputModelForUpdatingBlog {
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExist()
    @IsMongoId()
    id: string;
    @IsString()
    @Length(1, 15)
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    youtubeUrl: string;
}
