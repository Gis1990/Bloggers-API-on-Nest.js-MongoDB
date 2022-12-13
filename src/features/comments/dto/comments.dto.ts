import { IsString, Length, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsCommentsIdExist } from "../comments.custom.decorators";
import { Type } from "class-transformer";

const listOfCorrectLikeStatus = ["None", "Like", "Dislike"];

export class ModelForGettingAllComments {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    PageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    PageSize: number;
}

export class ModelForUpdatingComment {
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    content: string;
}

export class CommentsIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsCommentsIdExist()
    id: string;
}

export class ModelForLikeStatus {
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectLikeStatus)
    likeStatus: string;
}

export class ModelForCreatingNewComment {
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    content: string;
}
