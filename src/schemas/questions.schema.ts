import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

@Schema({ versionKey: false })
export class QuestionClass {
    @Prop({
        required: true,
    })
    id: string;
    @Prop({
        required: true,
    })
    body: string;
    @Prop({
        type: [String],
        required: true,
    })
    correctAnswers: string[];
    @Prop({
        required: true,
    })
    published: boolean;
    @Prop({
        required: true,
    })
    createdAt: Date;
    @Prop()
    updatedAt: Date | null;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionClass);

@Schema({ versionKey: false })
export class QuestionsForGameClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the question" })
    @Prop({
        required: true,
    })
    id: string;
    @ApiProperty({ type: String })
    @Prop({
        required: true,
    })
    body: string;
}

export const QuestionsForGameSchema = SchemaFactory.createForClass(QuestionsForGameClass);
