import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable, Inject, forwardRef, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BloggersService } from "./bloggers.service";

@ValidatorConstraint({ name: "IsBloggersIdExist", async: true })
@Injectable()
export class IsBloggersIdExistConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(forwardRef(() => BloggersService)) protected bloggersService: BloggersService) {}
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

export const BodyAndParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return { body: req.body, params: req.params };
});
