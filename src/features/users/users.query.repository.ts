import { Injectable } from "@nestjs/common";
import { UserAccountDBClass, UserDBClassPagination } from "./entities/users.entity";
import { UsersAccountModelClass } from "../../db";
import { ModelForGettingAllUsers } from "./dto/users.dto";

@Injectable()
export class UsersQueryRepository {
    async getAllUsers(dto: ModelForGettingAllUsers): Promise<UserDBClassPagination> {
        const {
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

        // Retrieve the documents from the UsersAccountModelClass collection, applying the query, sort, skip, and limit options
        const cursor = await UsersAccountModelClass.find(query, { _id: 0, id: 1, login: 1, email: 1, createdAt: 1 })
            .sort(sortObj)
            .skip(skips)
            .limit(pageSize)
            .lean();

        // Count the total number of documents that match the query
        const totalCount = await UsersAccountModelClass.count(query);

        // Return a new UserDBClassPagination object with the calculated pagination information and the retrieved documents
        return new UserDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }

    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        const user = await UsersAccountModelClass.findOne(
            { id: id },
            {
                _id: 0,
                id: 1,
                login: 1,
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

    async findUserByDeviceId(deviceId: string): Promise<UserAccountDBClass | null> {
        const user = await UsersAccountModelClass.findOne({ userDevicesData: { $elemMatch: { deviceId: deviceId } } });
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne(
            { $or: [{ email: loginOrEmail }, { login: loginOrEmail }] },
            {
                _id: 0,
            },
        );
    }

    async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ "emailRecoveryCode.recoveryCode": recoveryCode });
    }
}
