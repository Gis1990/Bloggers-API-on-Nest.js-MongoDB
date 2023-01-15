import "reflect-metadata";
import * as request from "supertest";
import { app, createBlogForTests, setupTestApp, teardownTestApp } from "./test.functions";

describe("blogs endpoint (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    // it("3.Should return status 401 (/post) ", async () => {
    //     const correctBlog = createBlogForTests(10, 5, true);
    //     await request(app.getHttpServer()).post("/blogs").send(correctBlog).expect(401);
    // });
});
