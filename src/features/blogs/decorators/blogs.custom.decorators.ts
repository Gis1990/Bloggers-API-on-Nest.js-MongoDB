import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";
import { HttpException, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetBlogByIdCommand } from "../use-cases/queries/get-blog-by-id-query";

@ValidatorConstraint({ name: "IsBlogsIdExist", async: true })
@Injectable()
export class IsBlogsIdExistConstraint implements ValidatorConstraintInterface {
    constructor(private queryBus: QueryBus) {}

    async validate(blogId: string) {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(blogId));
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
    constructor(private queryBus: QueryBus) {}

    async validate(blogId: string) {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(blogId));
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
