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
    IsUUID,
} from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { QuestionClass, QuestionsForGameClass } from "../schemas/questions.schema";
import { PlayerProgressClass } from "../schemas/games.schema";
import { IsQuestionIdExist } from "../decorators/quiz/quiz.custom.decorators";
import { ModelForGettingAllBlogs } from "./blogs.dto";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

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
    @IsUUID()
    @IsNotEmpty()
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

export class InputModelForAnswers {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    public answer: string;
}

export class ModelForGettingAllGamesForUser extends ModelForGettingAllBlogs {
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

export class GameStatsViewModelDto {
    public sumScore: number;
    public avgScores: number;
    public gamesCount: number;
    public winsCount: number;
    public lossesCount: number;
    public drawsCount: number;
}

export class AnswerViewModelDto {
    @ApiProperty({ example: uuidv4() })
    public questionId: string;
    @ApiProperty({ example: "Correct", enum: ["Correct", "Incorrect"] })
    public answerStatus: ["Correct", "Incorrect"];
    @ApiProperty({ example: new Date() })
    public addedAt: Date;
}

export class ModelForGettingTopUsers {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageNumber: number;
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    public pageSize: number;
    @IsOptional()
    public sort: string[] | string;
}
