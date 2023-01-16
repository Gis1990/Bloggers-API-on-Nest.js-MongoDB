export async function createQuery(dto: any) {
    const { searchNameTerm = null, pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = dto;
    const skips = pageSize * (pageNumber - 1);
    const sortObj = {};
    sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;
    const query: any = {};
    if (searchNameTerm) {
        query.name = { $regex: searchNameTerm, $options: "i" };
    }
    return { query, skips, sortObj, pageSize, pageNumber };
}

export async function getBannedUsersIdsBySuperAdmin() {
    let bannedUsersIds = [];
    const bannedUsersInDB = await this.userAccountClass.find({ "banInfo.isBanned": true });
    if (bannedUsersInDB) {
        bannedUsersIds = bannedUsersInDB.map((elem) => elem.id);
    }
    return bannedUsersIds;
}

export async function getBannedBlogsIds(bannedUsersIdsBySuperAdmin: string[]) {
    let bannedBlogsIds = [];
    const bannedBlogsInDB = await this.blogsModelClass.find({
        $or: [{ "blogOwnerInfo.userId": { $in: bannedUsersIdsBySuperAdmin } }, { "banInfo.isBanned": true }],
    });
    if (bannedBlogsInDB) {
        bannedBlogsIds = bannedBlogsInDB.map((elem) => elem.id);
    }
    return bannedBlogsIds;
}
