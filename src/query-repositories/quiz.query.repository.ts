import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QueryDto } from "../dtos/blogs.dto";
import { QuestionClass } from "../schemas/questions.schema";
import { QuestionsPaginationDtoClass } from "../dtos/questions.dto";

@Injectable()
export class QuizQueryRepository {
    constructor(@InjectModel(QuestionClass.name) private questionModelClass: Model<QuestionClass>) {}

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
}
