import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { BlogsQueryRepository } from "./blogs.query.repository";

@ValidatorConstraint({ name: "IsBlogsIdExist", async: true })
@Injectable()
export class IsBlogsIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

    async validate(blogId: string) {
        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        if (!blog) {
            throw new HttpException("blog not found", 404);
        } else {
            return true;
        }
    }
}

export function IsBlogsIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogsIdExistConstraint,
        });
    };
}

@ValidatorConstraint({ name: "IsBlogsIdExistInTheRequestBodyExist", async: true })
@Injectable()
export class IsBlogsIdExistInTheRequestBodyConstraint implements ValidatorConstraintInterface {
    constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

    async validate(blogId: string) {
        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        return !!blog;
    }
}

export function IsBlogsIdExistInTheRequestBody(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogsIdExistInTheRequestBodyConstraint,
        });
    };
}
