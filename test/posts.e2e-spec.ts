import "reflect-metadata";
import request from "supertest";
import {
    app,
    createBlogForTests,
    createPostForTesting,
    createUserForTesting,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("posts endpoint (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    it("should return status 204 and change like status (/put) ", async () => {
        // Test creating a new user and expecting a status code of 201
        const correctUser1 = createUserForTesting(5, 2, 10);
        await request(app.getHttpServer())
            .post("/sa/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                login: correctUser1.login,
                email: correctUser1.email,
                password: correctUser1.password,
            })
            .expect(201);
        // Test logging in as the new user and expecting a status code of 200 and a JWT access token and refresh token in the cookie
        const response2 = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser1.login, password: correctUser1.password })
            .expect(200);
        const accessToken1 = response2.body.accessToken;
        // Create  a new blog and expecting a status code of 201
        const correctBlog1 = createBlogForTests(10, 5, true);
        const response = await request(app.getHttpServer())
            .post("/blogger/blogs")
            .set("authorization", "Bearer " + accessToken1)
            .send(correctBlog1)
            .expect(201);
        const blogId = response.body.id;
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPost = createPostForTesting(15, 30, 200, blogId);
        const response3 = await request(app.getHttpServer())
            .post(`/blogger/blogs/${blogId}/posts`)
            .set("authorization", "Bearer " + accessToken1)
            .send(correctNewPost)
            .expect(201);
        const postId = response3.body.id;
        // Test trying to update like-status for post without being logged in and expecting a status code of 401
        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).send({ likeStatus: "Like" }).expect(401);
        // Test trying to update like status for non-existent post and expecting a status code of 404
        await request(app.getHttpServer())
            .put(`/posts/5/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Like" })
            .expect(404);
        // Test trying to update a post's like status with an invalid value and expecting a status code of 400
        const response5 = await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Incorrect" })
            .expect(400);
        expect(response5.body).toEqual({ errorsMessages: [{ field: "likeStatus", message: expect.any(String) }] });
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Like" })
            .expect(204);
        // Test for checking like status and likes count for non-logged user  and expecting a status code of 200
        const response6 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
        // Test for checking like status and likes count for logged user,who put like  and expecting a status code of 200
        expect(response6.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response6.body.extendedLikesInfo.myStatus).toBe("None");
        const response7 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken1)
            .expect(200);
        expect(response7.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response7.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response7.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response7.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser1.login);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Dislike" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put dislike  and expecting a status code of 200
        const response8 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken1)
            .expect(200);
        expect(response8.body.extendedLikesInfo.likesCount).toBe(0);
        expect(response8.body.extendedLikesInfo.dislikesCount).toBe(1);
        expect(response8.body.extendedLikesInfo.myStatus).toBe("Dislike");
        expect(response8.body.extendedLikesInfo.newestLikes.length).toBe(0);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "None" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put None status  and expecting a status code of 200
        const response9 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken1)
            .expect(200);
        expect(response9.body.extendedLikesInfo.likesCount).toBe(0);
        expect(response9.body.extendedLikesInfo.dislikesCount).toBe(0);
        expect(response9.body.extendedLikesInfo.myStatus).toBe("None");
        expect(response9.body.extendedLikesInfo.newestLikes.length).toBe(0);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Dislike" })
            .expect(204);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken1)
            .send({ likeStatus: "Like" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put like  and expecting a status code of 200
        const response10 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken1)
            .expect(200);
        expect(response10.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response10.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response10.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response10.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser1.login);
    });
    it("should return status 204 and change like status", async () => {
        const users = [
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
        ];
        const accessTokens = [];
        const userIds = [];
        for (const user of users) {
            const response1 = await request(app.getHttpServer())
                .post("/sa/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    login: user.login,
                    email: user.email,
                    password: user.password,
                })
                .expect(201);
            userIds.push(response1.body.id);
            const response2 = await request(app.getHttpServer())
                .post("/auth/login")
                .send({ loginOrEmail: user.login, password: user.password })
                .expect(200);
            accessTokens.push(response2.body.accessToken);
        }
        // Create  a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        const response1 = await request(app.getHttpServer())
            .post("/blogger/blogs")
            .set("authorization", "Bearer " + accessTokens[0])
            .send(correctBlog)
            .expect(201);
        const blogId = response1.body.id;
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPost = createPostForTesting(15, 30, 200, blogId);
        const response2 = await request(app.getHttpServer())
            .post(`/blogger/blogs/${blogId}/posts`)
            .set("authorization", "Bearer " + accessTokens[0])
            .send(correctNewPost)
            .expect(201);
        const postId = response2.body.id;
        // Test for checking like status and likes count  and dislike count for logged 2 different users
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessTokens[3])
            .send({ likeStatus: "Like" })
            .expect(204);
        const response3 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessTokens[3])
            .expect(200);
        expect(response3.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response3.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response3.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response3.body.extendedLikesInfo.newestLikes[0].login).toBe(users[3].login);
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessTokens[2])
            .send({ likeStatus: "Like" })
            .expect(204);
        const response4 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessTokens[2])
            .expect(200);
        expect(response4.body.extendedLikesInfo.likesCount).toBe(2);
        expect(response4.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response4.body.extendedLikesInfo.newestLikes.length).toBe(2);
        expect(response4.body.extendedLikesInfo.newestLikes[0].login).toBe(users[3].login);
    });
});
