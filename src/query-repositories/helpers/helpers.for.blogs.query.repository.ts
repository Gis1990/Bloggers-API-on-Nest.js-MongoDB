import { ModelForGettingAllBlogs, QueryDto } from "../../dtos/blogs.dto";

export class HelperForBlogs {
    static createQuery(dto: ModelForGettingAllBlogs): QueryDto {
        const {
            searchNameTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;
        const query: any = {};
        if (searchNameTerm) {
            query.name = { $regex: searchNameTerm, $options: "i" };
        }
        return { query, skips, sortObj, pageSize, pageNumber };
    }
}
