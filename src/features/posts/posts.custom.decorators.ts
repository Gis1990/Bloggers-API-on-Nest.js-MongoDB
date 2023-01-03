import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { PostsQueryRepository } from "./posts.query.repository";

@ValidatorConstraint({ name: "IsPostIdExist", async: true })
@Injectable()
export class IsPostIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected postsQueryRepository: PostsQueryRepository) {}

    async validate(postId: string): Promise<boolean> {
        const userId = undefined;
        const post = await this.postsQueryRepository.getPostById(postId, userId);
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
            validator: IsPostIdExistConstraint,
        });
    };
}
