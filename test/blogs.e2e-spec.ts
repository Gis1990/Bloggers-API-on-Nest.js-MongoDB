import "reflect-metadata";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AppModule } from "../src/app.module";
import mongoose from "mongoose";
import { BlogsModelClass } from "../src/db";
import { HttpExceptionFilter } from "../src/exception.filter";
import * as cookieParser from "cookie-parser";
import { useContainer } from "class-validator";

const testValidationPipeSettings = {
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach((ckey) => {
                errorsForResponse.push({
                    message: e.constraints[ckey],
                    field: e.property,
                });
            });
        });
        throw new BadRequestException(errorsForResponse);
    },
};

export const randomString = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const creatingBlogForTests = (nameLen: number, descriptionLen: number, correct: boolean) => {
    let url;
    if (correct) {
        url = "https://www.somesite.com/" + randomString(5);
    } else {
        url = "";
    }
    return {
        name: randomString(nameLen),
        description: randomString(descriptionLen),
        websiteUrl: url,
    };
};

const createPostForTestingInBlogs = (
    titleLen: number,
    shortDescriptionLen: number,
    contentLen: number,
    blogId: string,
) => {
    return {
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId: blogId,
    };
};

const emptyAllBlogsDbReturnData = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
};

const createDbReturnDataForAllBlogs = (
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    blogs: object,
) => {
    return {
        pagesCount: pagesCount,
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        items: [blogs],
    };
};

describe("blogs endpoint (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        mongoose.set("strictQuery", false);
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.enableCors();
        app.useGlobalPipes(new ValidationPipe(testValidationPipeSettings));
        app.useGlobalFilters(new HttpExceptionFilter());
        app.use(cookieParser());
        useContainer(app.select(AppModule), { fallbackOnErrors: true });
        await app.init();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await app.close();
    });
    it("1.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    it("2.Should return status 200 and correct body (/get)", async () => {
        const response = await request(app.getHttpServer()).get("/blogs").expect(200);
        expect(response.body).toEqual(emptyAllBlogsDbReturnData);
    });
    it("3.Should return status 401 (/post) ", async () => {
        const correctBlog = creatingBlogForTests(10, 5, true);
        await request(app.getHttpServer()).post("/blogs").send(correctBlog).expect(401);
    });
    it("4.Should return status 400 and array with error in websiteUrl (/post)", async () => {
        const notCorrectBlog = creatingBlogForTests(11, 7, false);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(notCorrectBlog)
            .expect(400);
        expect(response.body).toEqual({ errorsMessages: [{ field: "websiteUrl", message: expect.any(String) }] });
    });
    it("5.Should return status 400 and array with errors in name and websiteUrl (/post)", async () => {
        const notCorrectBlog = creatingBlogForTests(20, 7, false);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(notCorrectBlog)
            .expect(400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "name",
                    message: expect.any(String),
                },
                { field: "websiteUrl", message: expect.any(String) },
            ],
        });
    });
    it("6.Should return status 400 and array with error in name (/post)", async () => {
        const notCorrectBlog = creatingBlogForTests(30, 5, true);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(notCorrectBlog)
            .expect(400);
        expect(response.body).toEqual({ errorsMessages: [{ field: "name", message: expect.any(String) }] });
    });
    it("7.Should return status 400 and array with error in name (/post)", async () => {
        const notCorrectBlog = creatingBlogForTests(0, 5, true);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(notCorrectBlog)
            .expect(400);
        expect(response.body).toEqual({ errorsMessages: [{ field: "name", message: expect.any(String) }] });
    });
    it("8.Should return status 400 and array with errors in name and websiteUrl (/post)", async () => {
        const notCorrectBlog = creatingBlogForTests(0, 10, false);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(notCorrectBlog)
            .expect(400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: "name",
                    message: expect.any(String),
                },
                { field: "websiteUrl", message: expect.any(String) },
            ],
        });
    });
    it("9.should create and retrieve blogs", async () => {
        // Create blog1
        const correctBlog1 = creatingBlogForTests(10, 5, true);
        const response = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog1)
            .expect(201);

        expect(response.body).toEqual({
            id: expect.any(String),
            description: correctBlog1.description,
            name: correctBlog1.name,
            websiteUrl: correctBlog1.websiteUrl,
            createdAt: expect.any(String),
        });

        // Get all blogs
        const response2 = await request(app.getHttpServer()).get("/blogs").expect(200);

        expect(response2.body).toEqual(
            createDbReturnDataForAllBlogs(1, 1, 10, 1, {
                id: expect.any(String),
                description: correctBlog1.description,
                name: correctBlog1.name,
                websiteUrl: correctBlog1.websiteUrl,
                createdAt: expect.any(String),
            }),
        );

        // Create blog2
        const correctBlog2 = creatingBlogForTests(11, 300, true);
        const response3 = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog2)
            .expect(201);

        expect(response3.body).toEqual({
            id: expect.any(String),
            description: correctBlog2.description,
            name: correctBlog2.name,
            websiteUrl: correctBlog2.websiteUrl,
            createdAt: expect.any(String),
        });

        // Get all blogs
        const response4 = await request(app.getHttpServer()).get("/blogs").expect(200);

        expect(response4.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    description: correctBlog2.description,
                    name: correctBlog2.name,
                    websiteUrl: correctBlog2.websiteUrl,
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    description: correctBlog1.description,
                    name: correctBlog1.name,
                    websiteUrl: correctBlog1.websiteUrl,
                    createdAt: expect.any(String),
                },
            ],
        });
        // Get  correct blog with correct pagination (/get )
        const response5 = await request(app.getHttpServer()).get("/blogs?pageNumber=1&pageSize=1").expect(200);
        expect(response5.body.items[0].id).toEqual(expect.any(String));
        expect(response5.body.items[0].createdAt).toEqual(expect.any(String));
        expect(response5.body).toEqual(
            createDbReturnDataForAllBlogs(2, 1, 1, 2, {
                id: response5.body.items[0].id,
                description: correctBlog2.description,
                name: correctBlog2.name,
                websiteUrl: correctBlog2.websiteUrl,
                createdAt: response5.body.items[0].createdAt,
            }),
        );
        // Get  correct blog with correct pagination (/get )
        const response6 = await request(app.getHttpServer()).get("/blogs?pageNumber=2&pageSize=1").expect(200);
        expect(response6.body.items[0].id).toEqual(expect.any(String));
        expect(response6.body).toEqual(
            createDbReturnDataForAllBlogs(2, 2, 1, 2, {
                id: response6.body.items[0].id,
                description: correctBlog1.description,
                name: correctBlog1.name,
                websiteUrl: correctBlog1.websiteUrl,
                createdAt: response6.body.items[0].createdAt,
            }),
        );
        // return status 200 and correct blog by Id (/get)
        const blog1 = await BlogsModelClass.findOne({ name: correctBlog1.name });
        const response7 = await request(app.getHttpServer()).get(`/blogs/${blog1?.id}`).expect(200);
        expect(response7.body.createdAt).toEqual(expect.any(String));
        expect(blog1?.id).toEqual(expect.any(String));
        expect(response7.body).toEqual({
            id: blog1?.id,
            name: correctBlog1.name,
            description: correctBlog1.description,
            websiteUrl: correctBlog1.websiteUrl,
            createdAt: response7.body.createdAt,
        });
        // Should return status 204 and updated blog (/put)
        const blog2 = await BlogsModelClass.findOne({ name: correctBlog1.name });
        const updatedCorrectBlog = creatingBlogForTests(10, 5, true);
        await request(app.getHttpServer())
            .put(`/blogs/${blog2?.id}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                name: updatedCorrectBlog.name,
                description: updatedCorrectBlog.description,
                websiteUrl: updatedCorrectBlog.websiteUrl,
            })
            .expect(204);
        const response8 = await request(app.getHttpServer()).get(`/blogs/${blog2?.id}`).expect(200);
        expect(response8.body.name).toBe(updatedCorrectBlog.name);
        expect(response8.body.websiteUrl).toBe(updatedCorrectBlog.websiteUrl);
        expect(response8.body.description).toBe(updatedCorrectBlog.description);
        // Should return status 400 and and array with error in name (/put)
        const updatedIncorrectBlog = creatingBlogForTests(100, 200, true);
        const blog3 = await BlogsModelClass.findOne({ name: updatedCorrectBlog.name });
        const response9 = await request(app.getHttpServer())
            .put(`/blogs/${blog3?.id}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                name: updatedIncorrectBlog.name,
                description: updatedIncorrectBlog.description,
                websiteUrl: updatedIncorrectBlog.websiteUrl,
            })
            .expect(400);
        expect(response9.body).toEqual({ errorsMessages: [{ field: "name", message: expect.any(String) }] });
        // Should return status 200 and correct blogs (/delete)
        const blog4 = await BlogsModelClass.findOne({ name: correctBlog2.name });
        await request(app.getHttpServer())
            .delete(`/blogs/${blog4?.id}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
        const response10 = await request(app.getHttpServer()).get("/blogs").expect(200);
        expect(response10.body.items.length).toBe(1);
        // Should return status 401 (/delete)
        const blog5 = await BlogsModelClass.findOne({ name: correctBlog2.name });
        await request(app.getHttpServer()).delete(`/blogs/${blog5?.id}`).expect(401);
        //Should return status 201 and a new post for specific blog (/post)
        const blog6 = await BlogsModelClass.findOne({ name: updatedCorrectBlog.name });
        const newPost = createPostForTestingInBlogs(15, 30, 200, blog6?.id);
        const response11 = await request(app.getHttpServer())
            .post(`/blogs/${blog6?.id}/posts`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(newPost)
            .expect(201);
        expect(response11.body.id).toEqual(expect.any(String));
        expect(response11.body).toEqual({
            id: response11.body.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: `${blog6?.id}`,
            blogName: updatedCorrectBlog.name,
            createdAt: response11.body.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: [],
            },
        });
        // Should return status 400 and array with errors (/post)
        const blog7 = await BlogsModelClass.findOne({ name: updatedCorrectBlog.name });
        const newIncorrectPost1 = createPostForTestingInBlogs(0, 50, 900, blog7!.id);
        const response12 = await request(app.getHttpServer())
            .post(`/blogs/${blog7?.id}/posts`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(newIncorrectPost1)
            .expect(400);
        expect(response12.body).toEqual({ errorsMessages: [{ field: "title", message: expect.any(String) }] });
        const newIncorrectPost2 = createPostForTestingInBlogs(0, 0, 300, blog7?.id);
        const response13 = await request(app.getHttpServer())
            .post(`/blogs/${blog7?.id}/posts`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(newIncorrectPost2)
            .expect(400);
        expect(response13.body).toEqual({
            errorsMessages: [
                {
                    field: "title",
                    message: expect.any(String),
                },
                { field: "shortDescription", message: expect.any(String) },
            ],
        });
        // Should return status 200 (/get)
        const blog8 = await BlogsModelClass.findOne({ name: updatedCorrectBlog.name });
        const response14 = await request(app.getHttpServer()).get(`/blogs/${blog8?.id}/posts`).expect(200);
        expect(response14.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    id: response14.body.items[0].id,
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: `${blog8?.id}`,
                    blogName: updatedCorrectBlog.name,
                    createdAt: response14.body.items[0].createdAt,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        newestLikes: [],
                    },
                },
            ],
        });
        // Should return status 200 with correct SearchNameTerm (/get)
        const response15 = await request(app.getHttpServer())
            .get(`/blogs?pageNumber=1&pageSize=1&searchNameTerm=${updatedCorrectBlog.name}`)
            .expect(200);
        expect(response15.body.items[0].name).toEqual(updatedCorrectBlog.name);
    });
    it("10.Should return status 404 with incorrect Id (/get)", async () => {
        await request(app.getHttpServer()).get(`/blogs/5`).expect(404);
    });
    it("11.Should return status 401 (/put) ", async () => {
        const correctBlog = creatingBlogForTests(11, 300, true);
        const response1 = await request(app.getHttpServer()).get("/blogs");
        await request(app.getHttpServer()).put(`/blogs/${response1.body.items[0].id}`).send(correctBlog).expect(401);
    });
    it("12.Should return status 404 for non existing id (/delete)", async () => {
        await request(app.getHttpServer())
            .delete(`/blogs/5`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });

    it("13.Should return status 404 (/get) ", async () => {
        await request(app.getHttpServer()).get(`/blogs/5/posts`).expect(404);
    });
});
