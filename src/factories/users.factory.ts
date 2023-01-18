import { UserAccountClass } from "../schemas/users.schema";
import {
    UserViewModelClass,
    UserViewModelClassPagination,
    UserViewModelForBannedUsersByBloggerClass,
    UserViewModelForBannedUsersByBloggerPaginationClass,
} from "../entities/users.entity";
import { UsersClassPaginationDto } from "../dtos/users.dto";

export class UsersFactory {
    static async createUserViewModelClass(user: UserAccountClass): Promise<UserViewModelClass> {
        return new UserViewModelClass(user.id, user.login, user.email, user.createdAt, user.banInfo);
    }

    static async createUserViewModelPaginationClass(
        dto: UsersClassPaginationDto,
    ): Promise<UserViewModelClassPagination> {
        const result = await Promise.all(
            dto.items.map((elem) => {
                return UsersFactory.createUserViewModelClass(elem);
            }),
        );
        return new UserViewModelClassPagination(dto.pagesCount, dto.page, dto.pageSize, dto.totalCount, result);
    }

    static async createUserViewModelForBannedUsersByBloggerPaginationClass(
        dto: UsersClassPaginationDto,
        blogId: string,
    ): Promise<UserViewModelForBannedUsersByBloggerPaginationClass> {
        const result = dto.items.filter((user) => user.banInfoForBlogs.blogId === blogId);
        const correctCursor = result.map((user) => {
            const banData = {
                isBanned: user.banInfoForBlogs[0].isBanned,
                banDate: user.banInfoForBlogs[0].banDate,
                banReason: user.banInfoForBlogs[0].banReason,
            };
            return new UserViewModelForBannedUsersByBloggerClass(user.id, user.login, banData);
        });
        return new UserViewModelForBannedUsersByBloggerPaginationClass(
            dto.pagesCount,
            dto.page,
            dto.pageSize,
            dto.totalCount,
            correctCursor,
        );
    }
}
