import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { QuestionsForGameClass, QuestionsForGameSchema } from "./questions.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

@Schema({ versionKey: false, _id: false })
export class PlayerForTheGameClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the user" })
    @Prop({
        required: true,
    })
    id: string;
    @ApiProperty({ type: String, description: "Login" })
    @Prop({
        required: true,
    })
    login: string;
}

export const PlayerForTheGameSchema = SchemaFactory.createForClass(PlayerForTheGameClass);

@Schema({ versionKey: false, _id: false })
export class AnswersClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the question" })
    @Prop({
        required: true,
    })
    questionId: string;
    @ApiProperty({ enum: ["Correct", "Incorrect"] })
    @Prop({
        required: true,
    })
    answerStatus: string;
    @Prop({
        required: true,
    })
    @ApiProperty({ example: new Date(), description: "Date of the answer" })
    addedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(AnswersClass);

@Schema({ versionKey: false, _id: false })
export class PlayerProgressClass {
    @ApiProperty({ type: [AnswersClass], required: true })
    @Prop({
        type: [AnswerSchema],
        required: true,
        _id: false,
    })
    answers: AnswersClass[];
    @ApiProperty({ type: PlayerForTheGameClass, required: true })
    @Prop({
        type: PlayerForTheGameSchema,
        required: true,
        _id: false,
    })
    player: PlayerForTheGameClass;
    @ApiProperty({
        example: 20,
        description: "Player score",
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    score: number;
}

export const PlayerProgressSchema = SchemaFactory.createForClass(PlayerProgressClass);

@Schema({ versionKey: false })
export class GamesClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the game" })
    @Prop({
        required: true,
    })
    id: string;
    @ApiProperty({ type: PlayerProgressClass, required: true })
    @Prop({
        type: PlayerProgressSchema,
        required: true,
        _id: false,
    })
    firstPlayerProgress: PlayerProgressClass;
    @ApiProperty({ type: PlayerProgressClass, required: true })
    @Prop({
        type: PlayerProgressSchema,
        _id: false,
    })
    secondPlayerProgress: PlayerProgressClass | null;
    @ApiProperty({
        type: [QuestionsForGameClass],
        required: true,
        nullable: true,
        description: "Questions for both players (can be null if second player haven't connected yet)",
    })
    @Prop({
        type: [QuestionsForGameSchema],
        _id: false,
    })
    questions: QuestionsForGameClass[] | null;
    @ApiProperty({ enum: ["PendingSecondPlayer", "Active", "Finished"] })
    @Prop({
        required: true,
    })
    status: string;
    @ApiProperty({ example: new Date(), description: "Date when first player initialized the pair" })
    @Prop({
        required: true,
    })
    pairCreatedDate: Date;
    @ApiProperty({
        example: new Date(),
        description: "Game starts immediately after second player connection to this pair",
        nullable: true,
    })
    @Prop()
    startGameDate: Date | null;
    @ApiProperty({
        example: new Date(),
        description: "Game finishes immediately after both players have answered all the questions",
        nullable: true,
    })
    @Prop()
    finishGameDate: Date | null;
}

export const GamesSchema = SchemaFactory.createForClass(GamesClass);

@Schema({ versionKey: false })
export class TopUsersStatsClass {
    @ApiProperty({
        example: 50,
        description: "Sum scores of all games",
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    sumScore: number;
    @ApiProperty({
        example: 50.51,
        description: "Average score of all games rounded to 2 decimal places",
        type: Number,
        format: "double",
    })
    @Prop({
        required: true,
    })
    avgScores: number;
    @ApiProperty({
        example: 10,
        description: "All played games count",
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    gamesCount: number;
    @ApiProperty({
        example: 3,
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    winsCount: number;
    @ApiProperty({
        example: 4,
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    lossesCount: number;
    @ApiProperty({
        example: 3,
        type: "integer",
        format: "int32",
    })
    @Prop({
        required: true,
    })
    drawsCount: number;
    @ApiProperty({ type: () => PlayerForTheGameClass })
    @Prop({
        type: PlayerForTheGameSchema,
        required: true,
        _id: false,
    })
    player: PlayerForTheGameClass;
}

export const TopUsersStatsSchema = SchemaFactory.createForClass(TopUsersStatsClass);
