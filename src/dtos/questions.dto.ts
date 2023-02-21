import {
    IsString,
    Length,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsIn,
    IsArray,
    ArrayNotEmpty,
    IsBoolean,
} from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { QuestionClass } from "../schemas/questions.schema";
import { IsQuestionIdExist } from "../decorators/quiz/questions.custom.decorators";

const listOfCorrectPublishedStatuses = ["all", "published", "notPublished"];

export class ModelForGettingAllQuestions {
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectPublishedStatuses)
    @IsOptional()
    public publishedStatus: string;
    @IsString()
    @IsOptional()
    public bodySearchTerm: string;
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

export class InputModelForCreatingAndUpdatingQuestion {
    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public body: string;
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    public correctAnswers: string[];
}

export class CreatedNewQuestionDto {
    public id: string;
    public body: string;
    public correctAnswers: string[];
    public published: boolean;
    public createdAt: Date;
    public updatedAt: Date;
}

export class QuestionsPaginationDtoClass {
    public pagesCount: number;
    public page: number;
    public pageSize: number;
    public totalCount: number;
    public items: QuestionClass[];
}

export class QuestionIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsQuestionIdExist()
    public id: string;
}

export class InputModelForPublishUnpublishQuestion {
    @IsBoolean()
    @IsNotEmpty()
    public published: boolean;
}
