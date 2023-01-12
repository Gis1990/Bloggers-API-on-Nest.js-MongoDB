import { Injectable } from "@nestjs/common";
import { UserDBClassPagination } from "./entities/users.entity";
import { ModelForGettingAllUsers } from "./dto/users.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BannedUsersClass, UserAccountClass } from "./users.schema";

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(UserAccountClass.name) private usersAccountModelClass: Model<UserAccountClass>,
        @InjectModel(BannedUsersClass.name) private bannedUserListClass: Model<BannedUsersClass>,
    ) {}

    async getAllUsers(dto: ModelForGettingAllUsers): Promise<UserDBClassPagination> {
        const {
            banStatus = "all",
            searchLoginTerm = null,
            searchEmailTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        // Calculate the number of documents to skip based on the page size and number
        const skips = pageSize * (pageNumber - 1);

        // Create an object for sorting the results based on the sortBy and sortDirection parameters
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }

        // Create a query object based on the searchLoginTerm and searchEmailTerm parameters
        let query: any = {};
        if (searchLoginTerm && searchEmailTerm) {
            query = {
                $or: [
                    { login: { $regex: searchLoginTerm, $options: "i" } },
                    { email: { $regex: searchEmailTerm, $options: "i" } },
                ],
            };
        }
        if (banStatus !== "all") {
            if (banStatus === "banned") {
                query = { ...query, banInfo: { $ne: null } };
            } else if (banStatus === "notBanned") {
                query = { ...query, banInfo: null };
            }
        }

        // Retrieve the documents from the UsersAccountModelClass collection, applying the query, sort, skip, and limit options
        const cursor = await this.usersAccountModelClass
            .find(query, { _id: 0, id: 1, login: 1, email: 1, createdAt: 1, banInfo: 1 })
            .sort(sortObj)
            .skip(skips)
            .limit(pageSize)
            .lean();

        // Count the total number of documents that match the query
        const totalCount = await this.usersAccountModelClass.count(query);

        // Return a new UserDBClassPagination object with the calculated pagination information and the retrieved documents
        return new UserDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async getAllBannedUsers(): Promise<any> {
        const bannedUsers = await this.bannedUserListClass.find({});
        if (bannedUsers) {
            return bannedUsers;
        } else {
            return null;
        }
    }

    async getUserById(id: string): Promise<UserAccountClass | null> {
        const user = await this.usersAccountModelClass.findOne(
            { id: id },
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                userDevicesData: 1,
                currentSession: 1,
                banInfo: 1,
            },
        );

        if (user) {
            return user;
        } else {
            return null;
        }
    }

    async getUserByDeviceId(deviceId: string): Promise<UserAccountClass | null> {
        const user = await this.usersAccountModelClass.findOne(
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
        return this.usersAccountModelClass.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    }

    async getUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountClass | null> {
        return this.usersAccountModelClass.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<UserAccountClass | null> {
        return this.usersAccountModelClass.findOne({ "emailRecoveryCode.recoveryCode": recoveryCode });
    }
}
