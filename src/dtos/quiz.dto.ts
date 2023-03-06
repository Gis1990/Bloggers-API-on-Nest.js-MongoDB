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
import { QuestionClass, QuestionsForGameClass } from "../schemas/questions.schema";
import { IsGameIdExist, IsQuestionIdExist } from "../decorators/quiz/quiz.custom.decorators";
import { PlayerProgressClass } from "../schemas/games.schema";

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

export class GameIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsGameIdExist()
    public id: string;
}

export class InputModelForPublishUnpublishQuestion {
    @IsBoolean()
    @IsNotEmpty()
    public published: boolean;
}

export class CreatedNewGameDto {
    public id: string;
    public firstPlayerProgress: PlayerProgressClass;
    public secondPlayerProgress: PlayerProgressClass | null;
    public questions: QuestionsForGameClass[] | null;
    public status: string;
    public pairCreatedDate: Date;
    public startGameDate: Date | null;
    public finishGameDate: Date | null;
}

export class UpdatedGameDto {
    public id: string;
    public secondPlayerProgress: PlayerProgressClass;
    public questions: QuestionsForGameClass[];
    public status: string;
    public startGameDate: Date;
}
