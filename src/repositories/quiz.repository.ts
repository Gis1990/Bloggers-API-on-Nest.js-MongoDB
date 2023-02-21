import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionClass } from "../schemas/questions.schema";
import {
    CreatedNewQuestionDto,
    InputModelForCreatingAndUpdatingQuestion,
    InputModelForPublishUnpublishQuestion,
} from "../dtos/questions.dto";

@Injectable()
export class QuizRepository {
    constructor(@InjectModel(QuestionClass.name) private questionModelClass: Model<QuestionClass>) {}

    async createQuestion(newQuestion: CreatedNewQuestionDto): Promise<QuestionClass> {
        const question = new this.questionModelClass(newQuestion);
        await question.save();
        return question;
    }

    async updateQuestionById(id: string, dto: InputModelForCreatingAndUpdatingQuestion): Promise<boolean> {
        const body = dto.body;
        const correctAnswers = dto.correctAnswers;
        const updatedAt = new Date();
        const result = await this.questionModelClass.updateOne(
            { id: id },
            { $set: { body, correctAnswers, updatedAt } },
        );
        return result.modifiedCount === 1;
    }

    async publishUnpublishQuestion(id: string, dto: InputModelForPublishUnpublishQuestion): Promise<boolean> {
        const published = dto.published;
        const result = await this.questionModelClass.updateOne({ id: id }, { $set: { published } });
        return result.modifiedCount === 1;
    }

    async deleteQuestionById(id: string): Promise<boolean> {
        const result = await this.questionModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
