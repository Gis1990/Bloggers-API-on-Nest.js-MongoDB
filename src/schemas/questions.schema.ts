import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
    @Prop({
        required: true,
    })
    updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionClass);
