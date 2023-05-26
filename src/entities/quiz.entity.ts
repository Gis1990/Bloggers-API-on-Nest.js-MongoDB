import { GamesClass, TopUsersStatsClass } from "../schemas/games.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

export class QuestionViewModelPaginationClass {
    @ApiProperty({
        example: 5,
        description: "The total number of pages",
        type: "integer",
        format: "int32",
    })
    public pagesCount: number;

    @ApiProperty({
        example: 1,
        description: "The current page number",
        type: "integer",
        format: "int32",
    })
    public page: number;

    @ApiProperty({
        example: 10,
        description: "The number of items per page",
        type: "integer",
        format: "int32",
    })
    public pageSize: number;

    @ApiProperty({
        example: 50,
        description: "The total number of items across all pages",
        type: "integer",
        format: "int32",
    })
    public totalCount: number;

    @ApiProperty({
        type: () => QuestionViewModelClass,
        isArray: true,
        description: "The array of blogs on the current page",
    })
    public items: QuestionViewModelClass[];

    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: QuestionViewModelClass[],
    ) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class QuestionViewModelClass {
    @ApiProperty({
        example: uuidv4(),
        description: "The unique identifier for the question",
        format: "uuid",
    })
    public id: string;

    @ApiProperty({
        type: String,
        example: "What is the capital of France?",
        description: "The body or content of the question",
    })
    public body: string;

    @ApiProperty({
        example: ["Paris"],
        description: "An array of strings representing the correct answer(s)",
        type: [String],
    })
    public correctAnswers: string[];

    @ApiProperty({
        type: Boolean,
        example: false,
        description: "Whether or not the question is published",
        default: false,
    })
    public published: boolean;

    @ApiProperty({
        example: new Date(),
        description: "The date and time the question was created",
    })
    public createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: "The date and time the question was last updated",
        default: null,
    })
    public updatedAt: Date;

    constructor(
        id: string,
        body: string,
        correctAnswers: string[],
        published: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.body = body;
        this.correctAnswers = correctAnswers;
        this.published = published;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class AllGamesViewModelClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: GamesClass[],
    ) {}
}

export class TopUsersModelPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: TopUsersStatsClass[],
    ) {}
}
