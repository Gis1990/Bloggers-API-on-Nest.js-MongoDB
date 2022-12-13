import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsMongoId, IsOptional } from "class-validator";
import { IsBlogsIdExist } from "../blogs.custom.decorators";
import { Type } from "class-transformer";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBlogs {
    @IsString()
    @IsOptional()
    searchNameTerm: string;
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
