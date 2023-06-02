import { IsString, Length, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsCommentsIdExist } from "../decorators/comments/comments.custom.decorators";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { UsersLikesInfoClass } from "../schemas/posts.schema";
import { CommentClass, LikesInfoClass, PostInfoClass } from "../schemas/comments.schema";
import { OwnerInfoClass } from "../schemas/blogs.schema";
import { ApiProperty } from "@nestjs/swagger";

const listOfCorrectLikeStatus = ["Like", "Dislike", "None"];

export class ModelForGettingAllComments {
    @ApiProperty({ default: 1, required: false, format: "int32" })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @ApiProperty({ default: 10, required: false, format: "int32" })
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

export class InputModelForUpdatingComment {
    @ApiProperty({ type: String, required: true, description: "Content of the comment", minLength: 20, maxLength: 300 })
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public content: string;
}

export class CommentsIdValidationModel {
    @ApiProperty({ required: true, description: "Id of the comment" })
    @IsString()
    @IsNotEmpty()
    @IsCommentsIdExist()
    public id: string;
}

export class InputModelForLikeStatus {
    @ApiProperty({
        example: "None",
        required: true,
        description: "Send None if you want to unlike or undislike",
        enum: ["Like", "Dislike", "None"],
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectLikeStatus)
    public likeStatus: string;
}

export class InputModelForCreatingNewComment {
    @ApiProperty({ type: String, required: true, description: "Content of the comment", minLength: 20, maxLength: 300 })
    @IsString()
    @Length(20, 300)
    @IsNotEmpty()
    public content: string;
}

export class CreatedCommentDto {
    public id: string;
    public content: string;
    public createdAt: Date;
    public likesInfo: LikesInfoClass;
    public usersLikesInfo: UsersLikesInfoClass;
    public commentatorInfo: OwnerInfoClass;
    public postInfo: PostInfoClass;
}

export class CommentClassPaginationDto {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: CommentClass[];
}
