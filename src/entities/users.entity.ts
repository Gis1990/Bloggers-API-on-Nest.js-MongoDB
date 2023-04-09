import { BanInfoClass } from "../schemas/users.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

export class UserViewModelClassPagination {
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
        type: () => UserViewModelClass,
        isArray: true,
        description: "The array of comments on the current page",
    })
    public items: UserViewModelClass[];

    constructor(pagesCount: number, page: number, pageSize: number, totalCount: number, items: UserViewModelClass[]) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class UserViewModelForBannedUsersByBloggerPaginationClass {
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
        type: () => UserViewModelForBannedUsersByBloggerClass,
        isArray: true,
        description: "The array of comments on the current page",
    })
    public items: UserViewModelForBannedUsersByBloggerClass[];

    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: UserViewModelForBannedUsersByBloggerClass[],
    ) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class UserViewModelClass {
    @ApiProperty({ example: uuidv4(), description: "The Id of the user" })
    id: string;

    @ApiProperty({ type: String, description: "The login of the user" })
    login: string;

    @ApiProperty({ type: String, description: "The email address of the user" })
    email: string;

    @ApiProperty({ example: new Date(), description: "The date and time the user was created" })
    createdAt: Date;

    @ApiProperty({ type: () => BanInfoClass, description: "Information about any active ban on the user" })
    banInfo: BanInfoClass;

    constructor(id: string, login: string, email: string, createdAt: Date, banInfo: BanInfoClass) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.createdAt = createdAt;
        this.banInfo = banInfo;
    }
}

export class UserViewModelForBannedUsersByBloggerClass {
    @ApiProperty({ example: uuidv4(), description: "The Id of the user" })
    id: string;

    @ApiProperty({ type: String, description: "The login of the user" })
    login: string;

    @ApiProperty({ type: () => BanInfoClass, description: "Information about the user ban" })
    banInfo: BanInfoClass;

    constructor(id: string, login: string, banInfo: BanInfoClass) {
        this.id = id;
        this.login = login;
        this.banInfo = banInfo;
    }
}
