import { ExtendedLikesInfoClass, ImagesForPostsClass } from "../schemas/posts.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

export class PostViewModelClassPagination {
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
        type: () => PostViewModelClass,
        isArray: true,
        description: "The array of comments on the current page",
    })
    public items: PostViewModelClass[];

    constructor(pagesCount: number, page: number, pageSize: number, totalCount: number, items: PostViewModelClass[]) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class PostViewModelClass {
    @ApiProperty({ example: uuidv4(), description: "The ID of the post" })
    id: string;

    @ApiProperty({ type: String, description: "The title of the post" })
    title: string;

    @ApiProperty({ type: String, description: "The short description of the post" })
    shortDescription: string;

    @ApiProperty({ type: String, description: "The content of the post" })
    content: string;

    @ApiProperty({ example: uuidv4(), description: "The ID of the blog that the post belongs to" })
    blogId: string;

    @ApiProperty({ type: String, description: "The name of the blog that the post belongs to" })
    blogName: string;

    @ApiProperty({ example: new Date(), description: "The date and time the post was created" })
    createdAt: Date;

    @ApiProperty({
        type: () => ExtendedLikesInfoClass,
        description: "Information about the likes received by the post",
    })
    extendedLikesInfo: ExtendedLikesInfoClass;

    @ApiProperty({ type: ImagesForPostsClass, description: "Images for post" })
    images: ImagesForPostsClass;

    constructor(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: Date,
        extendedLikesInfo: ExtendedLikesInfoClass,
        images: ImagesForPostsClass,
    ) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = extendedLikesInfo;
        this.images = images;
    }
}
