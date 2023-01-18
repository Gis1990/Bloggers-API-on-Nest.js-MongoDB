import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetAllBannedUsersBySuperAdminCommand {}

@QueryHandler(GetAllBannedUsersBySuperAdminCommand)
export class GetAllBannedUsersBySuperAdminQuery implements IQueryHandler<GetAllBannedUsersBySuperAdminCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(): Promise<string[]> {
        let bannedUsersIdsBySuperAdmin = [];
        const bannedUsersInDB = await this.usersQueryRepository.getAllBannedUsersBySuperAdmin();
        if (bannedUsersInDB) {
            bannedUsersIdsBySuperAdmin = bannedUsersInDB.map((elem) => elem.id);
        }
        return bannedUsersIdsBySuperAdmin;
    }
}
