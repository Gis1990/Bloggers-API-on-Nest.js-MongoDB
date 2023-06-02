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
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

const listOfCorrectPublishedStatuses = ["all", "published", "notPublished"];

export class ModelForGettingAllQuestions {
    @ApiProperty({ default: "all", required: false, enum: ["all", "published", "notPublished"] })
    @IsString()
    @IsNotEmpty()
    @IsIn(listOfCorrectPublishedStatuses)
    @IsOptional()
    public publishedStatus: string;
    @ApiProperty({ type: String, description: "The search term ", default: null, required: false })
    @IsString()
    @IsOptional()
    public bodySearchTerm: string;
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

export class InputModelForCreatingAndUpdatingQuestion {
    @ApiProperty({
        type: String,
        example: "What is the capital of France?",
        description: "The body or content of the question",
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    public body: string;
    @ApiProperty({
        example: ["Paris"],
        description: "An array of strings representing the correct answer(s)",
        type: [String],
    })
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
    @ApiProperty({ required: true, description: "Id of the question" })
    @IsString()
    @IsNotEmpty()
    @IsQuestionIdExist()
    public id: string;
}

export class GameIdValidationModel {
    @ApiProperty({ required: true, description: "Id of the game", example: uuidv4() })
    @IsUUID()
    @IsNotEmpty()
    public id: string;
}

export class InputModelForPublishUnpublishQuestion {
    @ApiProperty({ required: true, type: Boolean })
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

export class ModelForGettingAllGamesForUser {
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
    @ApiProperty({ default: "pairCreatedDate", required: false })
    @IsString()
    @IsOptional()
    public sortBy: string;
    @ApiProperty({ default: "desc", required: false, enum: ["asc", "desc"] })
    @IsString()
    @IsOptional()
    public sortDirection: string;
}

export class GameStatsViewModelDto {
    @ApiProperty({
        example: 50,
        description: "Sum scores of all games",
        type: "integer",
        format: "int32",
    })
    public sumScore: number;
    @ApiProperty({
        example: 50.51,
        description: "Average score of all games rounded to 2 decimal places",
        type: Number,
        format: "double",
    })
    public avgScores: number;
    @ApiProperty({
        example: 10,
        description: "All played games count",
        type: "integer",
        format: "int32",
    })
    public gamesCount: number;
    @ApiProperty({
        example: 3,
        type: "integer",
        format: "int32",
    })
    public winsCount: number;
    @ApiProperty({
        example: 4,
        type: "integer",
        format: "int32",
    })
    public lossesCount: number;
    @ApiProperty({
        example: 3,
        type: "integer",
        format: "int32",
    })
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
    @ApiProperty({
        type: [String],
        required: false,
        description: "Default value : ?sort=avgScores desc&sort=sumScore desc",
    })
    @IsOptional()
    public sort: string[] | string;
}
