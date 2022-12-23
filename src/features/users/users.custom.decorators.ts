import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "./users.query.repository";

@ValidatorConstraint({ name: "IsUsersIdExist", async: true })
@Injectable()
export class IsUsersIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected usersQueryRepository: UsersQueryRepository) {}

    async validate(userId: string) {
        const user = await this.usersQueryRepository.findUserById(userId);
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
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async validate(value: string) {
        const user = await this.usersQueryRepository.findByLoginOrEmail(value);
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
    constructor(protected usersQueryRepository: UsersQueryRepository) {}

    async validate(value: string) {
        const user = await this.usersQueryRepository.findByLoginOrEmail(value);
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

@ValidatorConstraint({ name: "IsEmailNotExist", async: true })
@Injectable()
export class IsEmailNotExistConstraint implements ValidatorConstraintInterface {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async validate(value: string) {
        const user = await this.usersQueryRepository.findByLoginOrEmail(value);
        return !!user;
    }
}

export function IsEmailNotExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailNotExistConstraint,
        });
    };
}
