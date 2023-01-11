export async function createQueryForBlogs(dto) {
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
