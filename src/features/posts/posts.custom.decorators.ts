import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { PostsService } from "./posts.service";

@ValidatorConstraint({ name: "IsPostIdExist", async: true })
@Injectable()
export class IsPostIdExistExistConstraint implements ValidatorConstraintInterface {
    constructor(protected postsService: PostsService) {}
    async validate(postId: string) {
        const post = await this.postsService.getPostById(postId, undefined);
        if (!post) {
            throw new HttpException("Post not found", 404);
        } else {
            return true;
        }
    }
}

export function IsPostIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPostIdExistExistConstraint,
        });
    };
}
