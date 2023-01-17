import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";

import { HttpException, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserByDeviceIdCommand } from "../../queries/users/get-user-by-device-id-query";

@ValidatorConstraint({ name: "IsDeviceIdExist", async: true })
@Injectable()
export class IsDeviceIdExistConstraint implements ValidatorConstraintInterface {
    constructor(private queryBus: QueryBus) {}

    async validate(deviceId: string) {
        const user = await this.queryBus.execute(new GetUserByDeviceIdCommand(deviceId));
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
