import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { IsBlogsIdExist, IsBlogsIdExistForBanUnbanOperation } from "../decorators/blogs/blogs.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { BlogClass } from "../schemas/blogs.schema";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBlogs {
    @IsString()
    @IsOptional()
    public searchNameTerm: string;
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

export class InputModelForCreatingBlog {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public name: string;
    @IsString()
    @Length(1, 500)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public description: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    @IsNotEmpty()
    public websiteUrl: string;
}

export class BlogsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExist()
    public id: string;
}

export class BlogsIdValidationModelWhenBlogIsBanned {
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExistForBanUnbanOperation()
    public id: string;
}

export class InputModelForBanUnbanBlog {
    @IsBoolean()
    @IsNotEmpty()
    public isBanned: boolean;
}

export class InputModelForUpdatingBlog {
    @IsString()
    @Length(1, 15)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public name: string;
    @IsString()
    @Length(1, 500)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public description: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    public websiteUrl: string;
}

export class CreatedBlogDto {
    public id: string;
    public name: string;
    public description: string;
    public websiteUrl: string;
    public createdAt: Date;
    public blogOwnerInfo: {
        userId: string;
        userLogin: string;
    };
    public banInfo: {
        isBanned: boolean;
        banDate: Date;
    };
}

export class ForBanUnbanBlogBySuperAdminDto {
    public isBanned: boolean;
    public banDate: Date | null;
}

export class QueryDto {
    public query: any;
    public skips: number;
    public sortObj: any;
    public pageSize: any;
    public pageNumber: any;
}

export class BlogClassPaginationDto {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: BlogClass[];
}
