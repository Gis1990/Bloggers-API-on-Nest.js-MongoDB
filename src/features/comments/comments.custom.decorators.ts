import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@ValidatorConstraint({ name: "IsCommentsIdExist", async: true })
@Injectable()
export class IsCommentsIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected commentsService: CommentsService) {}
    async validate(commentId: string) {
        const comment = await this.commentsService.getCommentById(commentId, undefined);
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
