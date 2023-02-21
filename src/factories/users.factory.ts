import { UserAccountClass } from "../schemas/users.schema";
import {
    UserViewModelClass,
    UserViewModelClassPagination,
    UserViewModelForBannedUsersByBloggerClass,
    UserViewModelForBannedUsersByBloggerPaginationClass,
} from "../entities/users.entity";
import { UsersPaginationDto } from "../dtos/users.dto";

export class UsersFactory {
    static async createUserViewModelClass(user: UserAccountClass): Promise<UserViewModelClass> {
        return new UserViewModelClass(user.id, user.login, user.email, user.createdAt, user.banInfo);
    }

    static async createUserViewModelPaginationClass(dto: UsersPaginationDto): Promise<UserViewModelClassPagination> {
        const result = await Promise.all(
            dto.items.map((elem) => {
                return UsersFactory.createUserViewModelClass(elem);
            }),
        );
        return new UserViewModelClassPagination(dto.pagesCount, dto.page, dto.pageSize, dto.totalCount, result);
    }

    static async createUserViewModelForBannedUsersByBloggerPaginationClass(
        dto: UsersPaginationDto,
        blogId: string,
    ): Promise<UserViewModelForBannedUsersByBloggerPaginationClass> {
        dto.items.filter((user) => user.banInfoForBlogs.blogId === blogId);
        const correctCursor = [];
        dto.items.forEach((user) => {
            const banData = {
                isBanned: user.banInfoForBlogs[0].isBanned,
                banDate: user.banInfoForBlogs[0].banDate,
                banReason: user.banInfoForBlogs[0].banReason,
            };
            correctCursor.push(new UserViewModelForBannedUsersByBloggerClass(user.id, user.login, banData));
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
