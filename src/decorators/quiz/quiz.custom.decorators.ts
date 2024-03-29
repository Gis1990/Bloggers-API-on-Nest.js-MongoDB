import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetQuestionByIdCommand } from "../../queries/quiz/get-question-by-id-query";

@ValidatorConstraint({ name: "IsQuestionIdExist", async: true })
@Injectable()
export class IsQuestionIdExistConstraint implements ValidatorConstraintInterface {
    constructor(private queryBus: QueryBus) {}

    async validate(questionId: string) {
        const question = await this.queryBus.execute(new GetQuestionByIdCommand(questionId));
        if (!question) {
            throw new HttpException("Question not found", 404);
        } else {
            return true;
        }
    }
}

export function IsQuestionIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsQuestionIdExistConstraint,
        });
    };
}
