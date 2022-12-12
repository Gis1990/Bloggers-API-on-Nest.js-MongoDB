import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { BlogsService } from "./blogs.service";

@ValidatorConstraint({ name: "IsblogsIdExist", async: true })
@Injectable()
export class IsBlogsIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected blogsService: BlogsService) {}
    async validate(blogId: string) {
        const blog = await this.blogsService.getBlogById(blogId);
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
