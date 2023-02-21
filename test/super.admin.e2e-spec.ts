import "reflect-metadata";
import * as request from "supertest";
import {
    app,
    CheckingDbEmptiness,
    createBlogForTests,
    createQuestionForTesting,
    createUserForTesting,
    CreatingUsersForTesting,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("super admin endpoint users /sa/users (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
        await CheckingDbEmptiness();
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("POST -> /sa/users/", () => {
        let correctUser;
        const items = [];
        it("should return status 401 when creating a user without authorization", async () => {
            correctUser = createUserForTesting(5, 2, 10);
            await request(app.getHttpServer()).post("/sa/users").send(correctUser).expect(401);
        });
        it("should return status 201 and correct body when creating a user with correct data", async () => {
            correctUser = createUserForTesting(6, 2, 10);
            const response = await request(app.getHttpServer())
                .post("/sa/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send(correctUser)
                .expect(201);
            expect(response.body).toStrictEqual({
                id: expect.any(String),
                login: correctUser.login,
                email: correctUser.email,
                createdAt: expect.any(String),
                banInfo: {
                    isBanned: expect.any(Boolean),
                    banReason: null,
                    banDate: null,
                },
            });
            items.push(response.body);
        });
        it("should return status 201 and correct body when creating another user with correct data", async () => {
            const correctUser2 = createUserForTesting(5, 2, 10);
            const response = await request(app.getHttpServer())
                .post("/sa/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send(correctUser2)
                .expect(201);
            expect(response.body).toStrictEqual({
                id: expect.any(String),
                login: correctUser2.login,
                email: correctUser2.email,
                createdAt: expect.any(String),
                banInfo: {
                    isBanned: expect.any(Boolean),
                    banReason: null,
                    banDate: null,
                },
            });
            items.push(response.body);
        });
        it("should return status 200 and correct body", async () => {
            const response = await request(app.getHttpServer())
                .get("/sa/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(200);
            expect(response.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: items.reverse(),
            });
        });
        describe("Testing invalid data for post requests", () => {
            it("should return status 400 and error message", async () => {
                const incorrectUser = createUserForTesting(5, 2, 10);
                incorrectUser.login = correctUser.login;
                const response = await request(app.getHttpServer())
                    .post("/sa/users")
                    .set("authorization", "Basic YWRtaW46cXdlcnR5")
                    .send(incorrectUser)
                    .expect(400);
                expect(response.body).toStrictEqual({
                    errorsMessages: [{ field: "login", message: expect.any(String) }],
                });
            });
            it("should return status 400 and error message ", async () => {
                const incorrectUser = createUserForTesting(5, 2, 10);
                incorrectUser.email = correctUser.email;
                const response3 = await request(app.getHttpServer())
                    .post("/sa/users")
                    .set("authorization", "Basic YWRtaW46cXdlcnR5")
                    .send(incorrectUser)
                    .expect(400);
                expect(response3.body).toStrictEqual({
                    errorsMessages: [{ field: "email", message: expect.any(String) }],
                });
            });
            it("should return status 400 and error message", async () => {
                const incorrectUser = createUserForTesting(0, 2, 10);
                const response = await request(app.getHttpServer())
                    .post("/sa/users")
                    .set("authorization", "Basic YWRtaW46cXdlcnR5")
                    .send(incorrectUser)
                    .expect(400);
                expect(response.body).toStrictEqual({
                    errorsMessages: [{ field: "login", message: expect.any(String) }],
                });
            });
        });
    });
    describe("DELETE -> /sa/users/", () => {
        let userId;
        it("should return status 201 and correct body when creating a user with correct data", async () => {
            const correctUser = createUserForTesting(6, 2, 10);
            const response = await request(app.getHttpServer())
                .post("/sa/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send(correctUser)
                .expect(201);
            expect(response.body).toStrictEqual({
                id: expect.any(String),
                login: correctUser.login,
                email: correctUser.email,
                createdAt: expect.any(String),
                banInfo: {
                    isBanned: expect.any(Boolean),
                    banReason: null,
                    banDate: null,
                },
            });
            userId = response.body.id;
        });
        it("should return status 404 ", async () => {
            await request(app.getHttpServer())
                .delete("/sa/users/5")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(404);
        });
        it("should return status 401 ", async () => {
            await request(app.getHttpServer()).delete(`/sa/users/5`).expect(401);
        });
        it("should return status 204 ", async () => {
            await request(app.getHttpServer())
                .delete(`/sa/users/${userId}`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(204);
        });
        it("should return status 404 ", async () => {
            await request(app.getHttpServer())
                .get(`/sa/users/${userId}`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(404);
        });
    });
});
describe("super admin endpoint blogs /sa/blogs (e2e)", () => {
    let accessToken;
    let blogId1;
    const items = [];
    beforeAll(async () => {
        await setupTestApp();
        await CheckingDbEmptiness();
        const result = await CreatingUsersForTesting();
        accessToken = result.accessTokenForUser1;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("PUT -> /sa/blogs/:id/ban", () => {
        it("should return status 201 and correct body when creating blogs", async () => {
            const correctBlog1 = createBlogForTests(10, 5, true);
            const correctBlog2 = createBlogForTests(10, 5, true);
            const response1 = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessToken)
                .send(correctBlog1)
                .expect(201);
            expect(response1.body).toStrictEqual({
                id: expect.any(String),
                name: correctBlog1.name,
                description: correctBlog1.description,
                websiteUrl: correctBlog1.websiteUrl,
                createdAt: expect.any(String),
            });
            blogId1 = response1.body.id;
            items.push(response1.body);
            const response2 = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessToken)
                .send(correctBlog2)
                .expect(201);
            expect(response2.body).toStrictEqual({
                id: expect.any(String),
                name: correctBlog2.name,
                description: correctBlog2.description,
                websiteUrl: correctBlog2.websiteUrl,
                createdAt: expect.any(String),
            });
            items.push(response2.body);
            const response3 = await request(app.getHttpServer()).get("/blogs").send(correctBlog2).expect(200);
            expect(response3.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: items.reverse(),
            });
        });
        it("should return status 204 and ban blog 1", async () => {
            await request(app.getHttpServer())
                .put(`/sa/blogs/${blogId1}/ban`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    isBanned: true,
                })
                .expect(204);
        });
        it("should return status 404 for banned blog 1", async () => {
            await request(app.getHttpServer()).get(`/blogs/${blogId1}`).expect(404);
        });
        it("should return status 200 and blog 2", async () => {
            const response = await request(app.getHttpServer()).get(`/blogs`).expect(200);
            expect(response.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [items[0]],
            });
        });
        it("should return status 200 and blog 2", async () => {
            const response = await request(app.getHttpServer())
                .get(`/sa/blogs`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(200);
            expect(response.body.items.length).toBe(2);
        });
        it("should return status 204 and unban blog 1", async () => {
            await request(app.getHttpServer())
                .put(`/sa/blogs/${blogId1}/ban`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    isBanned: false,
                })
                .expect(204);
            const response = await request(app.getHttpServer()).get("/blogs").expect(200);
            expect(response.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: items,
            });
        });
    });
});
describe("super admin endpoint quiz /sa/quiz (e2e)", () => {
    const items = [];
    beforeAll(async () => {
        await setupTestApp();
        await CheckingDbEmptiness();
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("POST -> /sa/quiz/questions", () => {
        it("should return status 201 and correct body when creating question", async () => {
            const correctQuestion = createQuestionForTesting(10, 5);
            const response1 = await request(app.getHttpServer())
                .post("/sa/quiz/questions")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send(correctQuestion)
                .expect(201);
            expect(response1.body).toStrictEqual({
                id: expect.any(String),
                body: correctQuestion.body,
                correctAnswers: correctQuestion.correctAnswers,
                published: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
            items.push(response1.body);
        });
        it("should return status 200 and question", async () => {
            const response = await request(app.getHttpServer())
                .get(`/sa/quiz/questions`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(200);
            expect(response.body).toStrictEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [items[0]],
            });
        });
    });
});
