import { LikesInfoClass, PostInfoClass } from "../schemas/comments.schema";
import { OwnerInfoClass } from "../schemas/blogs.schema";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";

export class CommentViewModelPaginationClass {
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
        type: () => CommentViewModelClass,
        isArray: true,
        description: "The array of comments on the current page",
    })
    public items: CommentViewModelClass[];

    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: CommentViewModelClass[],
    ) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class CommentViewModelForBloggerPaginationClass {
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
        type: () => CommentViewModelForBloggerClass,
        isArray: true,
        description: "The array of comments on the current page",
    })
    public items: CommentViewModelForBloggerClass[];

    constructor(
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: CommentViewModelForBloggerClass[],
    ) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}

export class CommentViewModelClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the comment" })
    public id: string;

    @ApiProperty({ example: "Great post!", description: "The content of the comment" })
    public content: string;

    @ApiProperty({ type: () => OwnerInfoClass, description: "Information about the commentator" })
    public commentatorInfo: OwnerInfoClass;

    @ApiProperty({ example: new Date(), description: "The date and time that the comment was created" })
    public createdAt: Date;

    @ApiProperty({ type: () => LikesInfoClass, description: "Information about the likes received by the comment" })
    public likesInfo: LikesInfoClass;

    constructor(
        id: string,
        content: string,
        commentatorInfo: OwnerInfoClass,
        createdAt: Date,
        likesInfo: LikesInfoClass,
    ) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}

export class CommentViewModelForBloggerClass {
    @ApiProperty({ example: uuidv4(), description: "The unique identifier for the comment" })
    public id: string;

    @ApiProperty({ example: "This is a comment", description: "The content of the comment" })
    public content: string;

    @ApiProperty({ example: new Date(), description: "The date and time the comment was created" })
    public createdAt: Date;

    public likesInfo: LikesInfoClass;

    @ApiProperty({ type: () => OwnerInfoClass, description: "Information about the commentator" })
    public commentatorInfo: OwnerInfoClass;

    @ApiProperty({ type: () => PostInfoClass, description: "Information about the post the comment was made on" })
    public postInfo: PostInfoClass;

    constructor(
        id: string,
        content: string,
        createdAt: Date,
        likesInfo: LikesInfoClass,
        commentatorInfo: OwnerInfoClass,
        postInfo: PostInfoClass,
    ) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
        this.commentatorInfo = commentatorInfo;
        this.postInfo = postInfo;
    }
}
