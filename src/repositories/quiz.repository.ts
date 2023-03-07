import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionClass } from "../schemas/questions.schema";
import {
    CreatedNewGameDto,
    CreatedNewQuestionDto,
    InputModelForCreatingAndUpdatingQuestion,
    InputModelForPublishUnpublishQuestion,
    UpdatedGameDto,
} from "../dtos/quiz.dto";
import { GamesClass } from "../schemas/games.schema";

@Injectable()
export class QuizRepository {
    constructor(
        @InjectModel(QuestionClass.name) private questionModelClass: Model<QuestionClass>,
        @InjectModel(GamesClass.name) private gamesModelClass: Model<GamesClass>,
    ) {}

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
        const updatedAt = new Date();
        const result = await this.questionModelClass.updateOne({ id: id }, { $set: { published, updatedAt } });
        return result.modifiedCount === 1;
    }

    async deleteQuestionById(id: string): Promise<boolean> {
        const result = await this.questionModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async createGame(newGame: CreatedNewGameDto): Promise<GamesClass> {
        const game = new this.gamesModelClass(newGame);
        await game.save();
        return this.gamesModelClass.findOne({ id: game.id }, { _id: 0 });
    }

    async updateNewCreatedGame(dto: UpdatedGameDto): Promise<GamesClass> {
        const secondPlayer = dto.secondPlayerProgress;
        const questions = dto.questions;
        const status = dto.status;
        const startGameDate = dto.startGameDate;
        await this.gamesModelClass.updateOne(
            { id: dto.id },
            {
                $set: {
                    secondPlayer,
                    questions,
                    status,
                    startGameDate,
                },
            },
        );
        return this.gamesModelClass.findOne({ id: dto.id }, { _id: 0 });
    }

    async updateGameById(id: string, update: any): Promise<boolean> {
        const result = await this.gamesModelClass.updateOne({ id: id }, update);
        return result.matchedCount === 1;
    }

    async checkAnswerCorrectness(id: string, answer: string): Promise<boolean> {
        const correctAnswer = await this.questionModelClass.findOne(
            { id: id, correctAnswers: { $in: [answer] } },
            { _id: 0 },
        );
        return !!correctAnswer;
    }
}
