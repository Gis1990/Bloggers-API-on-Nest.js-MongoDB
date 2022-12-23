import { IsString, Length, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsCommentsIdExist } from "../comments.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";

const listOfCorrectLikeStatus = ["Like", "Dislike", "None"];

export class ModelForGettingAllComments {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public PageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public PageSize: number;
    @IsString()
    @IsOptional()
    public sortBy: string;
    @IsString()
    @IsOptional()
    public sortDirection: string;
}

export class ModelForUpdatingComment {
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public content: string;
}

export class CommentsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsCommentsIdExist()
    public id: string;
}

export class ModelForLikeStatus {
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectLikeStatus)
    public likeStatus: string;
}

export class ModelForCreatingNewComment {
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public content: string;
}
