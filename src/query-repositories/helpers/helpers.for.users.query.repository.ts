import { QueryDto } from "../../dtos/blogs.dto";
import { ModelForGettingAllBannedUsersForBlog, ModelForGettingAllUsers } from "../../dtos/users.dto";

export class HelperForUsers {
    static async createQueryForGettingAllusers(dto: ModelForGettingAllUsers): Promise<QueryDto> {
        const {
            banStatus = "all",
            searchLoginTerm = null,
            searchEmailTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        const skips = pageSize * (pageNumber - 1);

        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }

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
                query = { ...query, "banInfo.isBanned": true };
            } else if (banStatus === "notBanned") {
                query = { ...query, "banInfo.isBanned": true };
            }
        }

        return { query, skips, sortObj, pageSize, pageNumber };
    }

    static async createQueryForAllBannedUsersForBlog(dto: ModelForGettingAllBannedUsersForBlog): Promise<QueryDto> {
        const {
            searchLoginTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        const skips = pageSize * (pageNumber - 1);

        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }

        const query: any = {};
        if (searchLoginTerm) {
            query.login = { login: { $regex: searchLoginTerm, $options: "i" } };
        }

        return { query, skips, sortObj, pageSize, pageNumber };
    }
}
