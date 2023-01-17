import { UserAccountClass } from "../schemas/users.schema";
import { UserViewModelClass } from "../entities/users.entity";

export class UsersFactory {
    static async createUserViewModelClass(user: UserAccountClass): Promise<UserViewModelClass> {
        return new UserViewModelClass(user.id, user.login, user.email, user.createdAt, user.banInfo);
    }
}
