import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../schemas/users.schema";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetUserByDeviceIdCommand {
    constructor(public readonly deviceId: string) {}
}

@QueryHandler(GetUserByDeviceIdCommand)
export class GetUserByDeviceIdQuery implements IQueryHandler<GetUserByDeviceIdCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetUserByDeviceIdCommand): Promise<UserAccountClass | null> {
        return await this.usersQueryRepository.getUserByDeviceId(query.deviceId);
    }
}
