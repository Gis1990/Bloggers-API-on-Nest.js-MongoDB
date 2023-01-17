import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserAccountClass } from "../../schemas/users.schema";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetUserByRecoveryCodeCommand {
    constructor(public readonly recoveryCode: string) {}
}

@QueryHandler(GetUserByRecoveryCodeCommand)
export class GetUserByRecoveryCodeQuery implements IQueryHandler<GetUserByRecoveryCodeCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(query: GetUserByRecoveryCodeCommand): Promise<UserAccountClass | null> {
        return await this.usersQueryRepository.getUserByRecoveryCode(query.recoveryCode);
    }
}
