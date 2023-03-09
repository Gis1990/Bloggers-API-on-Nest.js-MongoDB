import { QueryDto } from "../../dtos/blogs.dto";
import { ModelForGettingAllGamesForUser, ModelForGettingAllQuestions } from "../../dtos/quiz.dto";

export class HelperForQuiz {
    static async createQueryForGettingAllQuestions(dto: ModelForGettingAllQuestions): Promise<QueryDto> {
        const {
            publishedStatus = "all",
            bodySearchTerm = null,
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
        if (bodySearchTerm) {
            query.body = { $regex: bodySearchTerm, $options: "i" };
        }
        if (publishedStatus !== "all") {
            if (publishedStatus === "published") {
                query = { ...query, published: true };
            } else if (publishedStatus === "notPublished") {
                query = { ...query, published: false };
            }
        }

        return { query, skips, sortObj, pageSize, pageNumber };
    }

    static async createQueryForGettingAllGamesForUser(dto: ModelForGettingAllGamesForUser): Promise<QueryDto> {
        const { pageNumber = 1, pageSize = 10, sortBy = "pairCreatedDate", sortDirection = "desc" } = dto;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;
        const query: any = {};
        return { query, skips, sortObj, pageSize, pageNumber };
    }
}
