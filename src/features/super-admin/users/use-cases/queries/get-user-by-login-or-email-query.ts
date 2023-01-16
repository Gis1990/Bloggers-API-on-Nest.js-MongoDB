import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../users.schema";
import { UsersQueryRepository } from "../../users.query.repository";

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
