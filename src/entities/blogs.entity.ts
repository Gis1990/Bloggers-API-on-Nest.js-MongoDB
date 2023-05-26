import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { BanInfoClassForBlog, ImagesForBlogsClass, OwnerInfoClass } from "../schemas/blogs.schema";
import { ImagesInfoClass } from "../schemas/posts.schema";

export class BlogViewModelClass {
    @ApiProperty({ example: uuidv4(), description: "The Id of the blog" })
    id: string;

    @ApiProperty({ type: String, description: "The name of the blog", maxLength: 15 })
    name: string;

    @ApiProperty({ type: String, description: "The description of the blog", maxLength: 500 })
    description: string;

    @ApiProperty({ example: "https://www.myblog.com", description: "The website URL of the blog" })
    websiteUrl: string;

    @ApiProperty({ example: new Date(), description: "The date and time the blog was created" })
    createdAt: Date;

    @ApiProperty({ example: true, description: "Whether the user is a member or not" })
    isMembership: boolean;

    @ApiProperty({ type: ImagesForBlogsClass, description: "Images for blog" })
    images: ImagesForBlogsClass;

    constructor(
        id: string,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: Date,
        isMembership: boolean,
        images: ImagesForBlogsClass,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
        this.images = images;
    }
}

export class BlogViewModelClassPagination {
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
        type: () => BlogViewModelClass,
        isArray: true,
        description: "The array of blogs on the current page",
    })
    public items: BlogViewModelClass[];

    constructor(pagesCount: number, page: number, pageSize: number, totalCount: number, items: BlogViewModelClass[]) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class BlogViewModelForAdminClass {
    @ApiProperty({ example: uuidv4(), description: "The Id of the blog" })
    id: string;

    @ApiProperty({ type: String, description: "The name of the blog", maxLength: 15 })
    name: string;

    @ApiProperty({ type: String, description: "The description of the blog", maxLength: 500 })
    description: string;

    @ApiProperty({ example: "https://www.myblog.com", description: "The website URL of the blog" })
    websiteUrl: string;

    @ApiProperty({ example: new Date(), description: "The date and time the blog was created" })
    createdAt: Date;

    @ApiProperty({ example: true, description: "Whether the user is a member or not" })
    isMembership: boolean;

    @ApiProperty({ type: OwnerInfoClass, description: "Info about owner of blog" })
    blogOwnerInfo: OwnerInfoClass;

    @ApiProperty({ type: BanInfoClassForBlog, description: "Ban information" })
    banInfo: BanInfoClassForBlog;

    constructor(
        id: string,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: Date,
        isMembership: boolean,
        blogOwnerInfo: OwnerInfoClass,
        banInfo: BanInfoClassForBlog,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
        this.blogOwnerInfo = blogOwnerInfo;
        this.banInfo = banInfo;
    }
}

export class BlogViewModelForAdminPaginationClass {
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
        type: () => BlogViewModelForAdminClass,
        isArray: true,
        description: "The array of blogs on the current page",
    })
    public items: BlogViewModelForAdminClass[];

    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: BlogViewModelForAdminClass[],
    ) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class ImageViewModelClass {
    @ApiProperty({ type: ImagesInfoClass, description: "Image for wallpaper" })
    wallpaper: ImagesInfoClass;
    @ApiProperty({ type: [ImagesInfoClass], description: "Image for main" })
    main: ImagesInfoClass[];

    constructor(wallpaper: ImagesInfoClass, main: ImagesInfoClass[]) {
        this.wallpaper = wallpaper;
        this.main = main;
    }
}
