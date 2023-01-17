import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../schemas/users.schema";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetUserByIdCommand {
    constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserByIdCommand)
export class GetUserByIdQuery implements IQueryHandler<GetUserByIdCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetUserByIdCommand): Promise<UserAccountClass | null> {
        return await this.usersQueryRepository.getUserById(query.userId);
    }
}
