import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../users.schema";
import { UsersQueryRepository } from "../../users.query.repository";

export class GetUserByDeviceIdCommand {
    constructor(public deviceId: string) {}
}

@QueryHandler(GetUserByDeviceIdCommand)
export class GetUserByDeviceIdQuery implements IQueryHandler<GetUserByDeviceIdCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetUserByDeviceIdCommand): Promise<UserAccountClass | null> {
        return await this.usersQueryRepository.getUserByDeviceId(query.deviceId);
    }
}
