import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../schemas/users.schema";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetUserByLoginOrEmailCommand {
    constructor(public readonly loginOrEmail: string) {}
}

@QueryHandler(GetUserByLoginOrEmailCommand)
export class GetUserByLoginOrEmailQuery implements IQueryHandler<GetUserByLoginOrEmailCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetUserByLoginOrEmailCommand): Promise<UserAccountClass | null> {
        return await this.usersQueryRepository.getUserByLoginOrEmail(query.loginOrEmail);
    }
}
