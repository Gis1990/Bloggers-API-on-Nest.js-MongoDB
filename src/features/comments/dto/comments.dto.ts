import { IsString, Length, IsIn, IsNotEmpty } from "class-validator";
import { IsCommentsIdExist } from "../comments.custom.decorators";

const listOfCorrectLikeStatus = ["None", "Like", "Dislike"];

export class ModelForGettingAllComments {
    PageNumber: number;
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
