import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetCommentForIdValidationCommand } from "../../queries/comments/get-comment-for-id-validation-query";

@ValidatorConstraint({ name: "IsCommentsIdExist", async: true })
@Injectable()
export class IsCommentsIdExistConstraint implements ValidatorConstraintInterface {
    constructor(private queryBus: QueryBus) {}

    async validate(commentId: string) {
        const comment = await this.queryBus.execute(new GetCommentForIdValidationCommand(commentId));
        if (!comment) {
            throw new HttpException("Comment  not found", 404);
        } else {
            return true;
        }
    }
}

export function IsCommentsIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCommentsIdExistConstraint,
        });
    };
}
