import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QueryDto } from "../dtos/blogs.dto";
import { QuestionClass } from "../schemas/questions.schema";
import { QuestionsPaginationDtoClass } from "../dtos/quiz.dto";
import { GamesClass } from "../schemas/games.schema";
import { AllGamesViewModelClass } from "../entities/quiz.entity";

@Injectable()
export class QuizQueryRepository {
    constructor(
        @InjectModel(QuestionClass.name) private questionModelClass: Model<QuestionClass>,
        @InjectModel(GamesClass.name) private gamesModelClass: Model<GamesClass>,
    ) {}

    async getAllQuestions(queryForQuestions: QueryDto): Promise<QuestionsPaginationDtoClass> {
        const cursor = await this.questionModelClass
            .find(queryForQuestions.query, { _id: 0 })
            .sort(queryForQuestions.sortObj)
            .skip(queryForQuestions.skips)
            .limit(queryForQuestions.pageSize);

        const totalCount = await this.questionModelClass.count(queryForQuestions.query);

        return {
            pagesCount: Math.ceil(totalCount / queryForQuestions.pageSize),
            page: queryForQuestions.pageNumber,
            pageSize: queryForQuestions.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getQuestionById(id: string): Promise<QuestionClass | null> {
        const question = await this.questionModelClass.findOne(
            { id: id },
            {
                _id: 0,
            },
        );
        if (question) {
            return question;
        } else {
            return null;
        }
    }

    async getPendingGame(): Promise<GamesClass | null> {
        const game = await this.gamesModelClass.findOne({ status: "PendingSecondPlayer" }, { _id: 0 });
        if (game) {
            return game;
        } else {
            return null;
        }
    }

    async getQuestionsForTheGame(): Promise<QuestionClass[]> {
        const allQuestions = await this.questionModelClass.find({ published: true }, { _id: 0 });
        const shuffledAllQuestions = allQuestions.sort(() => 0.5 - Math.random());
        return shuffledAllQuestions.slice(0, 5);
    }

    async getGameById(id: string): Promise<GamesClass | null> {
        const game = await this.gamesModelClass.findOne(
            { id: id },
            {
                _id: 0,
            },
        );
        if (game) {
            return game;
        } else {
            return null;
        }
    }

    async getGameByUserId(userId: string): Promise<GamesClass | null> {
        const game = await this.gamesModelClass.findOne(
            {
                $or: [{ "firstPlayerProgress.player.id": userId }, { "secondPlayerProgress.player.id": userId }],
                status: { $in: ["PendingSecondPlayer", "Active"] },
            },
            {
                _id: 0,
            },
        );
        if (game) {
            return game;
        } else {
            return null;
        }
    }

    async getAllGamesForUser(queryDtoForGames: QueryDto, userId: string): Promise<AllGamesViewModelClass> {
        const cursor = await this.gamesModelClass
            .find(
                {
                    $and: [
                        queryDtoForGames.query,
                        {
                            $or: [
                                { "firstPlayerProgress.player.id": userId },
                                { "secondPlayerProgress.player.id": userId },
                            ],
                        },
                    ],
                },
                {
                    _id: 0,
                },
            )
            .sort(queryDtoForGames.sortObj)
            .skip(queryDtoForGames.skips)
            .limit(queryDtoForGames.pageSize);
        const totalCount = await this.gamesModelClass.count({
            $or: [{ "firstPlayerProgress.player.id": userId }, { "secondPlayerProgress.player.id": userId }],
        });
        return {
            pagesCount: Math.ceil(totalCount / queryDtoForGames.pageSize),
            page: queryDtoForGames.pageNumber,
            pageSize: queryDtoForGames.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }
}
