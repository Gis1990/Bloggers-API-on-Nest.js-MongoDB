import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { BloggersService } from "./bloggers.service";

@ValidatorConstraint({ name: "IsBloggersIdExist", async: true })
@Injectable()
export class IsBloggersIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected bloggersService: BloggersService) {}
    async validate(bloggerId: string) {
        const blogger = await this.bloggersService.getBloggerById(bloggerId);
        if (!blogger) {
            throw new HttpException("Blogger not found", 404);
        } else {
            return true;
        }
    }
}

export function IsBloggersIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBloggersIdExistConstraint,
        });
    };
}
