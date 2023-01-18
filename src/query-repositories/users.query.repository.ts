import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserAccountClass } from "../schemas/users.schema";
import { QueryDto } from "../dtos/blogs.dto";
import { UsersClassPaginationDto } from "../dtos/users.dto";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(UserAccountClass.name) private userAccountClass: Model<UserAccountClass>) {}

    async getAllUsers(queryForUsers: QueryDto): Promise<UsersClassPaginationDto> {
        const cursor = await this.userAccountClass
            .find(queryForUsers.query, { _id: 0, id: 1, login: 1, email: 1, createdAt: 1, banInfo: 1 })
            .sort(queryForUsers.sortObj)
            .skip(queryForUsers.skips)
            .limit(queryForUsers.pageSize);

        const totalCount = await this.userAccountClass.count(queryForUsers.query);

        return {
            pagesCount: Math.ceil(totalCount / queryForUsers.pageSize),
            page: queryForUsers.pageNumber,
            pageSize: queryForUsers.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async GetAllBannedUsersForBlog(
        queryAllBannedUsersForBlog: QueryDto,
        blogId: string,
    ): Promise<UsersClassPaginationDto> {
        const cursor = await this.userAccountClass
            .find(
                { $and: [queryAllBannedUsersForBlog.query, { "banInfoForBlogs.blogId": blogId }] },
                {
                    _id: 0,
                },
            )
            .sort(queryAllBannedUsersForBlog.sortObj)
            .skip(queryAllBannedUsersForBlog.skips)
            .limit(queryAllBannedUsersForBlog.pageSize);

        const totalCount = await this.userAccountClass.count({
            $and: [queryAllBannedUsersForBlog.query, { "banInfoForBlogs.blogId": blogId }],
        });
        return {
            pagesCount: Math.ceil(totalCount / queryAllBannedUsersForBlog.pageSize),
            page: queryAllBannedUsersForBlog.pageNumber,
            pageSize: queryAllBannedUsersForBlog.pageSize,
            totalCount: totalCount,
            items: cursor,
        };
    }

    async getAllBannedUsersBySuperAdmin(): Promise<UserAccountClass[]> {
        return this.userAccountClass.find({ "banInfo.isBanned": true }, { id: 1 });
    }

    async getUserById(id: string): Promise<UserAccountClass | null> {
        const user = await this.userAccountClass.findOne(
            { id: id },
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                userDevicesData: 1,
                currentSession: 1,
                banInfo: 1,
                banInfoForBlogs: 1,
            },
        );
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    async getUserByDeviceId(deviceId: string): Promise<UserAccountClass | null> {
        const user = await this.userAccountClass.findOne(
            { userDevicesData: { $elemMatch: { deviceId: deviceId } } },
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                userDevicesData: 1,
                currentSession: 1,
            },
        );
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountClass | null> {
        return this.userAccountClass.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    }

    async getUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountClass | null> {
        return this.userAccountClass.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<UserAccountClass | null> {
        return this.userAccountClass.findOne({ "emailRecoveryCode.recoveryCode": recoveryCode });
    }
}
