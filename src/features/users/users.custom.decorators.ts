import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

@ValidatorConstraint({ name: "IsUsersIdExist", async: true })
@Injectable()
export class IsUsersIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected usersService: UsersService) {}
    async validate(userId: string) {
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new HttpException("User not found", 404);
        } else {
            return true;
        }
    }
}

export function IsUsersIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsersIdExistConstraint,
        });
    };
}

@ValidatorConstraint({ name: "IsEmailExist", async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
    constructor(protected usersService: UsersService) {}
    async validate(value: string) {
        const user = await this.usersService.findByEmail(value);
        return !user;
    }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailExistConstraint,
        });
    };
}

@ValidatorConstraint({ name: "IsLoginExist", async: true })
@Injectable()
export class IsLoginExistConstraint implements ValidatorConstraintInterface {
    constructor(protected usersService: UsersService) {}
    async validate(value: string) {
        const user = await this.usersService.findByLogin(value);
        return !user;
    }
}

export function IsLoginExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLoginExistConstraint,
        });
    };
}
