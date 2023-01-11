import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";

@ValidatorConstraint({ name: "IsDeviceIdExist", async: true })
@Injectable()
export class IsDeviceIdExistConstraint implements ValidatorConstraintInterface {
    constructor(protected usersQueryRepository: UsersQueryRepository) {}

    async validate(deviceId: string) {
        const user = await this.usersQueryRepository.getUserByDeviceId(deviceId);
        if (!user) {
            throw new HttpException("Device  not found", 404);
        } else {
            return true;
        }
    }
}

export function IsDeviceIdExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDeviceIdExistConstraint,
        });
    };
}
