import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { IsBlogsIdExist, IsBlogsIdExistForBanUnbanOperation } from "../decorators/blogs/blogs.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { BlogClass, ImagesForBlogsClass } from "../schemas/blogs.schema";
import { ApiProperty } from "@nestjs/swagger";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBlogs {
    @ApiProperty({ type: String, description: "The search term for a name", default: null, required: false })
    @IsString()
    @IsOptional()
    public searchNameTerm: string;
    @ApiProperty({ default: 1, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @ApiProperty({ default: 10, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageSize: number;
    @ApiProperty({ default: "createdAt", required: false })
    @IsString()
    @IsOptional()
    public sortBy: string;
    @ApiProperty({ default: "desc", required: false, enum: ["asc", "desc"] })
    @IsString()
    @IsOptional()
    public sortDirection: string;
}

export class InputModelForCreatingBlog {
    @ApiProperty({ type: String, maxLength: 15 })
    @IsString()
    @Length(1, 15)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public name: string;
    @ApiProperty({ type: String, maxLength: 500 })
    @IsString()
    @Length(1, 500)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public description: string;
    @ApiProperty({
        example: "https://www.somesite.com/",
        maxLength: 100,
        pattern: "/^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$/",
    })
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    public websiteUrl: string;
}

export class BlogsIdValidationModel {
    @ApiProperty({ required: true, description: "Id of blog for binding" })
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExist()
    public id: string;
}

export class BlogsIdValidationModelWhenBlogIsBanned {
    @ApiProperty({ required: true, description: "Id of blog which is banned/unbanned" })
    @IsString()
    @IsNotEmpty()
    @IsBlogsIdExistForBanUnbanOperation()
    public id: string;
}

export class InputModelForBanUnbanBlog {
    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    public isBanned: boolean;
}

export class InputModelForUpdatingBlog extends InputModelForCreatingBlog {}

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
    public isMembership: boolean;
    public images: ImagesForBlogsClass;
    public subscribers: string[];
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

export class FieldError {
    @ApiProperty({
        type: String,
        description: "Message with error explanation for certain field",
        nullable: true,
    })
    message: string;

    @ApiProperty({
        type: String,
        description: "What field/property of input model has error",
        nullable: true,
    })
    field: string;
}

export class APIErrorResult {
    @ApiProperty({
        type: [FieldError],
        description: "Array of error messages for specific fields/properties of input model",
        nullable: true,
    })
    errorsMessages: FieldError[];
}
