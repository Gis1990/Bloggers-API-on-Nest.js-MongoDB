import "reflect-metadata";
import request from "supertest";
import {
    app,
    createBlogForTests,
    createPostForTesting,
    CreatingUsersForTesting,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("blogger endpoint users  /blogger/users (e2e)", () => {
    let accessTokenForUser1;
    let accessTokenForUser2;
    let userId2;
    let userId3;
    let blogId1;
    beforeAll(async () => {
        await setupTestApp();
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
        const result = await CreatingUsersForTesting();
        accessTokenForUser1 = result.accessTokenForUser1;
        accessTokenForUser2 = result.accessTokenForUser2;
        userId2 = result.userId2;
        userId3 = result.userId3;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("PUT/GET -> /blogger/users/blog/:blogId", () => {
        it("should return status 201 and return created blog by user 1", async () => {
            const correctBlog = createBlogForTests(10, 5, true);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctBlog)
                .expect(201);
            blogId1 = response.body.id;
        });
        it("should return status 201 and return created blog by user 1", async () => {
            const correctBlog = createBlogForTests(10, 5, true);
            await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser2)
                .send(correctBlog)
                .expect(201);
        });
        it("should return status 204 and ban user 2 for blog ", async () => {
            await request(app.getHttpServer())
                .put(`/blogger/users/${userId2}/ban`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send({
                    isBanned: true,
                    banReason: "stringstringstringst",
                    blogId: blogId1,
                })
                .expect(204);
        });
        it("should return status 204 and ban user 3 for blog ", async () => {
            await request(app.getHttpServer())
                .put(`/blogger/users/${userId3}/ban`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send({
                    isBanned: true,
                    banReason: "stringstringstringst",
                    blogId: blogId1,
                })
                .expect(204);
        });
        it("should return status 204 and banned users for blog ", async () => {
            const response = await request(app.getHttpServer())
                .get(`/blogger/users/blog/${blogId1}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(200);
            expect(response.body.items.length).toBe(2);
        });
        it("should return status 204 and unban user 3 for blog ", async () => {
            await request(app.getHttpServer())
                .put(`/blogger/users/${userId3}/ban`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send({
                    isBanned: false,
                    banReason: "stringstringstringst",
                    blogId: blogId1,
                })
                .expect(204);
        });
        it("should return status 204 and banned user for blog ", async () => {
            const response = await request(app.getHttpServer())
                .get(`/blogger/users/blog/${blogId1}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(200);
            expect(response.body.items.length).toBe(1);
        });
    });
});
describe("blogger endpoint blogs  /blogger/blogs (e2e)", () => {
    let accessTokenForUser1;
    let accessTokenForUser2;
    let blogId1;
    let blogId2;
    beforeAll(async () => {
        await setupTestApp();
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
        const result = await CreatingUsersForTesting();
        accessTokenForUser1 = result.accessTokenForUser1;
        accessTokenForUser2 = result.accessTokenForUser2;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("POST/GET/DELETE -> /blogger/blogs", () => {
        it("should return status 201 and return created blog by user 1", async () => {
            const correctBlog = createBlogForTests(10, 5, true);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctBlog)
                .expect(201);
            blogId1 = response.body.id;
        });
        it("should return status 400 and array with error in websiteUrl (/post)", async () => {
            const notCorrectBlog = createBlogForTests(11, 7, false);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(notCorrectBlog)
                .expect(400);
            expect(response.body).toEqual({errorsMessages: [{field: "websiteUrl", message: expect.any(String)}]});
        });
        it("should return status 400 and array with errors in name and websiteUrl (/post)", async () => {
            const notCorrectBlog = createBlogForTests(20, 7, false);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(notCorrectBlog)
                .expect(400);
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "name",
                        message: expect.any(String),
                    },
                    {field: "websiteUrl", message: expect.any(String)},
                ],
            });
        });
        it("should return status 400 and array with error in name (/post)", async () => {
            const notCorrectBlog = createBlogForTests(30, 5, true);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(notCorrectBlog)
                .expect(400);
            expect(response.body).toEqual({errorsMessages: [{field: "name", message: expect.any(String)}]});
        });
        it("should return status 400 and array with error in name (/post)", async () => {
            const notCorrectBlog = createBlogForTests(0, 5, true);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(notCorrectBlog)
                .expect(400);
            expect(response.body).toEqual({errorsMessages: [{field: "name", message: expect.any(String)}]});
        });
        it("should return status 400 and array with errors in name and websiteUrl (/post)", async () => {
            const notCorrectBlog = createBlogForTests(0, 10, false);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(notCorrectBlog)
                .expect(400);
            expect(response.body).toEqual({
                errorsMessages: [
                    {
                        field: "name",
                        message: expect.any(String),
                    },
                    {field: "websiteUrl", message: expect.any(String)},
                ],
            });
        });
        it("should return status 201 and return created blog by user 2", async () => {
            const correctBlog1 = createBlogForTests(10, 5, true);
            const response = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser2)
                .send(correctBlog1)
                .expect(201);
            expect(response.body).toEqual({
                id: expect.any(String),
                description: correctBlog1.description,
                name: correctBlog1.name,
                websiteUrl: correctBlog1.websiteUrl,
                isMembership: false,
                images: {
                    main: [],
                    wallpaper: null
                },
                createdAt: expect.any(String),
            });
            blogId2 = response.body.id;
        });
        it("should return status 404 for non existing id ", async () => {
            await request(app.getHttpServer())
                .delete(`/blogger/blogs/5`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(404);
        });

        it("should return status 204 and delete blog ", async () => {
            await request(app.getHttpServer())
                .delete(`/blogger/blogs/${blogId2}`)
                .set("authorization", "Bearer " + accessTokenForUser2)
                .expect(204);
        });
        it("should return status 404 for deleted blog ", async () => {
            await request(app.getHttpServer()).get(`/blogs/${blogId2}`).expect(404);
        });
        it("should return status 201 and created post ", async () => {
            const correctNewPost1 = createPostForTesting(20, 50, 500, blogId1);
            await request(app.getHttpServer()).get(`/blogs/${blogId1}`).expect(200);
            const response1 = await request(app.getHttpServer())
                .post(`/blogger/blogs/${blogId1}/posts`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctNewPost1)
                .expect(201);
            expect(response1.body.extendedLikesInfo.myStatus).toBe("None");
            const correctDataForUpdating = createPostForTesting(20, 50, 500, blogId1);
            const postId1 = response1.body.id;
            await request(app.getHttpServer())
                .put(`/blogger/blogs/${blogId1}/posts/${postId1}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctDataForUpdating)
                .expect(204);
            await request(app.getHttpServer())
                .delete(`/blogger/blogs/${blogId1}/posts/${postId1}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(204);
            await request(app.getHttpServer()).get(`/posts/${postId1}`).expect(404);
        });
    });
});
