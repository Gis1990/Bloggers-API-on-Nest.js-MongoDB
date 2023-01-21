import "reflect-metadata";
import * as request from "supertest";
import {
    app,
    CheckingDbEmptiness,
    createBlogForTests,
    createPostForTesting,
    CreatingUsersForTesting,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("blogs endpoint (e2e)", () => {
    let accessTokenForUser1;
    let accessTokenForUser2;
    let blogId1;
    let blogId2;
    beforeAll(async () => {
        await setupTestApp();
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
        await CheckingDbEmptiness();
        const result = await CreatingUsersForTesting();
        accessTokenForUser1 = result.accessTokenForUser1;
        accessTokenForUser2 = result.accessTokenForUser2;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("GET -> /blogs", () => {
        it("should return status 201 and return created blogs by user 1,2", async () => {
            const correctBlog1 = createBlogForTests(10, 5, true);
            const correctBlog2 = createBlogForTests(10, 5, true);
            const response1 = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctBlog1)
                .expect(201);
            blogId1 = response1.body.id;
            const response2 = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser2)
                .send(correctBlog2)
                .expect(201);
            blogId2 = response2.body.id;
        });
        it("should return status 200 and  blog by user 1", async () => {
            await request(app.getHttpServer()).get(`/blogs/${blogId1}`).expect(200);
            await request(app.getHttpServer()).get(`/blogs/${blogId2}`).expect(200);
        });
        it("should return status 200 and  blogs ", async () => {
            const response = await request(app.getHttpServer()).get(`/blogs/`).expect(200);
            expect(response.body.items.length).toEqual(2);
        });
        it("should return status 201 and created post ", async () => {
            const correctNewPost1 = createPostForTesting(20, 50, 500, blogId1);
            await request(app.getHttpServer())
                .post(`/blogger/blogs/${blogId1}/posts`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctNewPost1)
                .expect(201);
            const correctNewPost2 = createPostForTesting(20, 50, 500, blogId2);
            await request(app.getHttpServer())
                .post(`/blogger/blogs/${blogId2}/posts`)
                .set("authorization", "Bearer " + accessTokenForUser2)
                .send(correctNewPost2)
                .expect(201);
            const response = await request(app.getHttpServer()).get(`/blogs/${blogId1}/posts`).expect(200);
            expect(response.body.items.length).toEqual(1);
        });
    });
});
