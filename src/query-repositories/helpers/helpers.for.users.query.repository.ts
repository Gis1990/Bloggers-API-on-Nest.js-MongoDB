import { QueryDto } from "../../dtos/blogs.dto";
import { ModelForGettingAllBannedUsersForBlog, ModelForGettingAllUsers } from "../../dtos/users.dto";

export class HelperForUsers {
    static async createQuery(dto: ModelForGettingAllUsers | ModelForGettingAllBannedUsersForBlog): Promise<QueryDto> {
        let query: any = {};
        let searchLoginTerm = null;
        let searchEmailTerm = null;
        let banStatus = "all";
        let pageNumber = 1;
        let pageSize = 10;
        let sortBy = "createdAt";
        let sortDirection = "desc";

        if (dto instanceof ModelForGettingAllUsers) {
            searchLoginTerm = dto.searchLoginTerm;
            searchEmailTerm = dto.searchEmailTerm;
            banStatus = dto.banStatus || banStatus;
            pageNumber = dto.pageNumber || pageNumber;
            pageSize = dto.pageSize || pageSize;
            sortBy = dto.sortBy || sortBy;
            sortDirection = dto.sortDirection || sortDirection;

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
        } else if (dto instanceof ModelForGettingAllBannedUsersForBlog) {
            searchLoginTerm = dto.searchLoginTerm;
            sortBy = dto.sortBy || sortBy;
            sortDirection = dto.sortDirection || sortDirection;
            pageNumber = dto.pageNumber || pageNumber;
            pageSize = dto.pageSize || pageSize;
            if (searchLoginTerm) {
                query = {
                    $or: [{ login: { $regex: searchLoginTerm, $options: "i" } }],
                };
            }
        }
        const skips = pageSize * (pageNumber - 1);

        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }

        return { query, skips, sortObj, pageSize, pageNumber };
    }
}
