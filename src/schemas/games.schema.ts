import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { QuestionsForGameClass, QuestionsForGameSchema } from "./questions.schema";

@Schema({ versionKey: false, _id: false })
export class PlayerForTheGameClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    login: string;
}

export const PlayerForTheGameSchema = SchemaFactory.createForClass(PlayerForTheGameClass);

@Schema({ versionKey: false, _id: false })
export class AnswersClass {
    @Prop({
        required: true,
    })
    questionId: string;
    @Prop({
        required: true,
    })
    answerStatus: string;
    @Prop({
        required: true,
    })
    addedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(AnswersClass);

@Schema({ versionKey: false, _id: false })
export class PlayerProgressClass {
    @Prop({
        type: [AnswerSchema],
        required: true,
        _id: false,
    })
    answers: AnswersClass[];
    @Prop({
        type: PlayerForTheGameSchema,
        required: true,
        _id: false,
    })
    player: PlayerForTheGameClass;
    @Prop({
        required: true,
    })
    score: number;
}

export const PlayerProgressSchema = SchemaFactory.createForClass(PlayerProgressClass);

@Schema({ versionKey: false })
export class GamesClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        type: PlayerProgressSchema,
        required: true,
        _id: false,
    })
    firstPlayerProgress: PlayerProgressClass;
    @Prop({
        type: PlayerProgressSchema,
        _id: false,
    })
    secondPlayerProgress: PlayerProgressClass | null;
    @Prop({
        type: [QuestionsForGameSchema],
        _id: false,
    })
    questions: QuestionsForGameClass[] | null;
    @Prop({
        required: true,
    })
    status: string;
    @Prop({
        required: true,
    })
    pairCreatedDate: Date;
    @Prop()
    startGameDate: Date | null;
    @Prop()
    finishGameDate: Date | null;
}

export const GamesSchema = SchemaFactory.createForClass(GamesClass);
