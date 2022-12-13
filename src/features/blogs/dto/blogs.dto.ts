import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import { IsBlogsIdExist } from "../blogs.custom.decorators";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBlogs {
    @IsString()
    searchNameTerm: string;
    @IsNumber()
    pageNumber: number;
    @IsNumber()
    pageSize: number;
    @IsString()
    sortBy: string;
    @IsString()
    sortDirection: string;
}

export class InputModelForCreatingBlog {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    name: string;
    @IsString()
    @Length(1, 500)
    @IsNotEmpty()
    description: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    @IsNotEmpty()
    websiteUrl: string;
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
    @Length(1, 500)
    @IsNotEmpty()
    description: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    websiteUrl: string;
}
